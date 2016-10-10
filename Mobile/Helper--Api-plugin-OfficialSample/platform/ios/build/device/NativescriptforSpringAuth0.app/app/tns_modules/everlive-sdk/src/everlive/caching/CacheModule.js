import constants from 'constants';
import _ from 'underscore';
import rsvp from 'rsvp';
import utils, {buildPromise} from 'utils';
import jsonStringify from 'json-stable-stringify';

import {RequestService} from 'services/RequestService';

import persisters from 'offline/offlinePersisters';
import {DataQueryOperations} from 'constants';
import {buildOfflineStorageOptions} from 'offline/offline';
import { EverliveError, EverliveErrors, EverliveErrorHelper } from 'EverliveError';

var CacheModule = function (options, everlive) {
    this.options = options;
    this.typeSettings = this.options.typeSettings;
    this.maxAgeInMs = this.options.maxAge * 60 * 1000;
    this._everlive = everlive;
};

var cacheableOperations = [
    DataQueryOperations.Read,
    DataQueryOperations.ReadById,
    DataQueryOperations.Count
];

/**
 * @class CacheModule
 * @classDesc A class providing access to the various caching features.
 */

/**
 * Represents the {@link CacheModule} class.
 * @memberOf Everlive.prototype
 * @member {CacheModule} cache
 */
CacheModule.prototype = {
    _hash: function (obj) {
        return jsonStringify(obj);
    },

    // using the offline storage options to initialize the same type of storage
    _initStore: function (sdkOptions) {
        if (!this.persister) {
            var offlineStorageOptions = buildOfflineStorageOptions(sdkOptions);
            var storageKey = this.options.storage.storagePath + '_' + sdkOptions.apiKey;

            this.persister = persisters.getPersister(storageKey, offlineStorageOptions);
        }
    },

    _getCacheData: function () {
        var self = this;

        if (!this.cacheData) {
            return this._persisterGetAllDataWrap()
                .then(function (cacheData) {
                    self.cacheData = cacheData;
                    return self.cacheData;
                });
        }

        return utils.successfulPromise(this.cacheData);
    },

    _persisterGetAllDataWrap: function () {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            return self.persister.getAllData(resolve, reject);
        });
    },

    _persisterSaveDataWrap: function (contentType, data) {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            return self.persister.saveData(contentType, JSON.stringify(data), resolve, reject);
        });
    },

    _getCacheDataForContentType: function (contentType) {
        return this._getCacheData()
            .then(function (cacheData) {
                if (typeof cacheData[contentType] === 'string') {
                    cacheData[contentType] = JSON.parse(cacheData[contentType]);
                } else {
                    cacheData[contentType] = cacheData[contentType] || {};
                }

                return _.clone(cacheData[contentType]);
            })
    },

    _persistCacheData: function (contentType, cacheData) {
        var self = this;

        return this._getCacheDataForContentType(contentType)
            .then(function () {
                var dataToCache = _.extend({}, self.cacheData[contentType], cacheData);
                self.cacheData[contentType] = _.compactObject(dataToCache);
                return self._persisterSaveDataWrap(contentType, self.cacheData[contentType]);
            });
    },

    isQueryUnsupportedOffline: function (dataQuery) {
        var hasPowerfieldsExpression = !!dataQuery.getHeader(constants.Headers.powerFields);
        var queryParams = dataQuery.getQueryParameters();
        var dataQueryFilter = queryParams.filter;
        var unsupportedDbOperators = utils.getUnsupportedOperators(dataQueryFilter);
        var hasUnsupportedOperators = unsupportedDbOperators.length !== 0;
        return hasPowerfieldsExpression || hasUnsupportedOperators;
    },

    _shouldSkipCache: function (dataQuery) {
        var operationShouldSkipCache = cacheableOperations.indexOf(dataQuery.operation) === -1;
        var collectionName = dataQuery.collectionName;
        var typeSettings = this.typeSettings;
        var cacheDisabledForContentType = typeSettings && typeSettings && typeSettings[collectionName] && typeSettings[collectionName].enabled === false;
        var ignoreCacheForQuery = dataQuery.ignoreCache;

        var isUnsupportedOffline = this.isQueryUnsupportedOffline(dataQuery);
        var isForCurrentUser = dataQuery.additionalOptions && dataQuery.additionalOptions.id === 'me';

        return operationShouldSkipCache || cacheDisabledForContentType || isForCurrentUser || ignoreCacheForQuery || isUnsupportedOffline;
    },

    _processCacheItem: function (dataQuery, data) {
        var self = this;

        var contentType = dataQuery.collectionName;
        var hash = this._getHashForQuery(dataQuery);
        
        return self._getCacheDataForContentType(contentType)
            .then(function (cacheData) {
                if (cacheData[hash]) {
                    return self._isHashExpired(contentType, hash, dataQuery.maxAge)
                        .then(function (isExpired) {
                            if (isExpired && !dataQuery.forceCache) {
                                return self._purgeForHash(contentType, hash)
                                    .then(function () {
                                        return self._cacheQuery(dataQuery, hash, data);
                                    });
                            } else {
                                //If cache is used, change 'me' to the ID of the logged in user (only for currentUser() requests).
                                if (dataQuery.operation === DataQueryOperations.ReadById && dataQuery.additionalOptions.id === 'me') {
                                    dataQuery.additionalOptions.id = self._everlive.setup.principalId;
                                }

                                return self._everlive.offlineStorage.processQuery(dataQuery);
                            }
                        });
                } else {
                    return self._cacheQuery(dataQuery, hash, data);
                }
            });
    },

    _addObjectToCache: function (obj, contentType, maxAge) {
        var itemHash = obj.Id;
        return this._cacheResultFromDataQuery(contentType, itemHash, maxAge);
    },

    _cacheQuery: function (dataQuery, hash, data) {
        const self = this;
        const contentType = dataQuery.collectionName;

        const promise = new rsvp.Promise(function (resolve, reject) {
            let result;
            return RequestService.handleRequestProcessing(dataQuery, data)
                .then(function (response) {
                    result = response.result || response;
                    return self._getCacheData();
                }).then(function success() {
                    let cacheForItems = [];
                    let resultToCache = result.Result || result;
                    if (dataQuery.operation !== DataQueryOperations.Count) {
                        if (Array.isArray(resultToCache)) {
                            _.each(resultToCache, function (singleResult) {
                                var cacheItemPromise = self._addObjectToCache(singleResult, contentType);
                                cacheForItems.push(cacheItemPromise);
                            });
                        } else if (_.isObject(resultToCache)) {
                            var cacheItemPromise = self._addObjectToCache(resultToCache, contentType);
                            cacheForItems.push(cacheItemPromise);
                        }
                    }

                    return rsvp.all(cacheForItems);
                }).then(function success() {
                    if (dataQuery.operation !== DataQueryOperations.Count) {
                        return self._cacheResultFromDataQuery(contentType, hash);
                    }
                }).then(function success() {
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                });
        });

        return promise;
    },

    _cacheResultFromDataQuery: function (contentType, hash) {
        var cacheData = {};
        cacheData[hash] = {
            cachedAt: Date.now()
        };

        return this._persistCacheData(contentType, cacheData);
    },

    _getExpirationForHash: function (contentType, hash) {
        return this._getCacheDataForContentType(contentType)
            .then(function (cacheData) {
                return cacheData[hash].cachedAt;
            });
    },

    _isHashExpired: function (contentType, hash, maxAge) {
        var self = this;

        return this._getExpirationForHash(contentType, hash)
            .then(function (cachedAt) {
                var maxAgeForContentType = self.typeSettings && self.typeSettings[contentType] ? self.typeSettings[contentType].maxAge * 60 * 1000 : null;
                var cacheAge;
                if (maxAge || maxAge === 0) {
                    cacheAge = maxAge;
                } else if (maxAgeForContentType || maxAgeForContentType === 0) {
                    cacheAge = maxAgeForContentType;
                } else {
                    cacheAge = self.maxAgeInMs;
                }
                return (cachedAt + cacheAge) < Date.now();
            });
    },

    _purgeForHash: function (contentType, hash) {
        var cacheData = {};
        cacheData[hash] = null;

        return this._persistCacheData(contentType, cacheData);
    },

    _getHashForQuery: function (dataQuery) {
        if (dataQuery.operation === DataQueryOperations.ReadById) {
            return dataQuery.additionalOptions.id;
        }

        var queryParams = dataQuery.getQueryParameters();
        return this._hash(queryParams);
    },

    /**
     * Clears the cached data for a specified content type.
     * @method clear
     * @name clear
     * @param {string} contentType The content type to clear.
     * @memberOf CacheModule.prototype
     * @returns {Promise}
     */
    /**
     * Clears the cached data for a specified content type.
     * @method clear
     * @name clear
     * @param {string} contentType The content type to clear.
     * @memberOf CacheModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    clear: function (contentType, success, error) {
        var self = this;

        return buildPromise(function (success, error) {
            if (!self.options.enabled) {
                const errorMessage = EverliveErrorHelper.buildCacheDisabledErrorMessage('clear');
                return error(new EverliveError(errorMessage, EverliveErrors.cacheDisabled.code));
            }

            return self.persister.purge(contentType, function () {
                if (self.cacheData && self.cacheData[contentType]) {
                    delete self.cacheData[contentType];
                }
                
                if (self._everlive.offlineStorage.setup.enabled) {
                    success();
                } else {
                    self._everlive.offlineStorage._queryProcessor._persister.purge(contentType, success, error);
                }
            }, error);
        }, success, error);
    },

    /**
     * Clears all data from the cache.
     * @method clearAll
     * @name clearAll
     * @memberOf CacheModule.prototype
     * @returns {Promise}
     */
    /**
     * Clears all data from the cache.
     * @method clearAll
     * @name clearAll
     * @memberOf CacheModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    clearAll: function (success, error) {
        var self = this;
        self.cacheData = null;

        return buildPromise(function (success, error) {
            if (self.options.enabled === false) {
                const errorMessage = EverliveErrorHelper.buildCacheDisabledErrorMessage('clearAll');
                return error(new EverliveError(errorMessage, EverliveErrors.cacheDisabled.code));
            }

            return self.persister.purgeAll(function () {
                if (self._everlive.offlineStorage.setup.enabled) {
                    success();
                } else {
                    self._everlive.offlineStorage._queryProcessor._persister.purgeAll(success, error);
                }
            }, error)
        }, success, error);
    }
};

module.exports = CacheModule;