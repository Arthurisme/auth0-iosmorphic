import DataQuery from 'dataQuery/DataQuery';
import {EverliveError, EverliveErrors} from 'EverliveError';
import constants, {offlineItemStates} from 'constants';
import RequestOptionsBuilder from 'query/RequestOptionsBuilder';
import _ from 'underscore';
import rsvp from 'rsvp';
import utils from 'utils';
import Request from 'Request';
import offlineTransformations from 'offline/offlineTransformations';
import {buildPromise} from 'utils';
import OfflineQueryProcessor from 'offline/OfflineQueryProcessor';
import OfflineFilesProcessor from 'offline/OfflineFilesProcessor';
import OfflineFilesModule from 'offline/OfflineFilesModule';
import Query from 'query/Query';
import {RequestService} from 'services/RequestService';

const syncLocation = {
    server: 'server',
    client: 'client'
};


/**
 * @class OfflineModule
 * @classDesc A class providing access to the various offline storage features.
 */

/**
 * Represents the {@link OfflineModule} class.
 * @memberOf Everlive.prototype
 * @member {OfflineModule} offlineStorage
 */

module.exports = (function() {
    function OfflineModule(everlive, options, persister, encryptionProvider) {
        this._everlive = everlive;
        this.setup = options;
        this._isSynchronizing = false;
        this._encryptionProvider = encryptionProvider;

        this._offlineFilesProcessor = new OfflineFilesProcessor(this.setup, this._everlive);
        this._queryProcessor = new OfflineQueryProcessor(persister, encryptionProvider,
            this._offlineFilesProcessor, this._everlive, this.setup);

        /**
         * @memberOf OfflineModule.prototype
         * @instance
         * @description An instance of the [OfflineFilesModule]{@link OfflineFilesModule} class for working with files in offline mode.
         * @member {OfflineFilesModule} files
         */
        this.files = new OfflineFilesModule(this._offlineFilesProcessor,
            this._everlive, this.setup.files.maxConcurrentDownloads);
    }

    var getSyncFilterForItem = function(item) {
        var filter = getSyncFilterNoModifiedAt(item);
        filter.ModifiedAt = item.ModifiedAt;
        return filter;
    };

    var getSyncFilterNoModifiedAt = function(item) {
        return {
            Id: item.Id
        }
    };


    OfflineModule.prototype = {
        /**
         * Removes all data from the offline storage. If caching is enabled clears the entire cache as well.
         * @method purgeAll
         * @name purgeAll
         * @memberOf OfflineModule.prototype
         * @param {function} [success] A success callback.
         * @param {function} [error] An error callback.
         */
        /**
         * Removes all data from the offline storage. If caching is enabled clears the entire cache as well.
         * @method purgeAll
         * @name purgeAll
         * @memberOf OfflineModule.prototype
         * @returns {Promise}
         */
        purgeAll: function(success, error) {
            return this._queryProcessor.purgeAll(success, error);
        },

        /**
         * Removes all data for a specific content type from the offline storage. If caching is enabled clears the cache
         * for the specified content type as well.
         * @method purge
         * @name purge
         * @memberOf OfflineModule.prototype
         * @param {string} contentType The content type to purge.
         * @param {function} [success] A success callback.
         * @param {function} [error] An error callback.
         */
        /**
         * Removes all data for a specific content type from the offline storage. If caching is enabled clears the cache
         * for the specified content type as well.
         * @method purge
         * @name purge
         * @memberOf OfflineModule.prototype
         * @param {string} contentType The content type to purge.
         * @returns {Promise}
         */
        purge: function(contentType, success, error) {
            return this._queryProcessor.purge(contentType, success, error);
        },

        processQuery: function(query) {
            return this._queryProcessor.processQuery(query);
        },

        _setOffline: function(offline) {
            this.setup.offline = offline;
        },

        isOnline: function() {
            return !this.setup.offline;
        },

        _prepareSyncData: function(contentTypesForSync) {
            var self = this;

            var contentTypesSyncData = {};
            var conflicts = [];
            _.each(contentTypesForSync, function(contentType, typeName) {
                var syncItems = offlineTransformations.idTransform(contentType.offlineItemsToSync);
                var syncData = self._getSyncItemStates(typeName, syncItems, contentType.serverItems);
                conflicts.push(syncData.conflicts);
                contentTypesSyncData[typeName] = syncData.itemsForSync;
            });

            return {
                conflicts: conflicts,
                contentTypesSyncData: contentTypesSyncData
            };
        },

        _resolveConflicts: function(syncData) {
            var self = this;
            return this._applyResolutionStrategy(syncData.conflicts)
                .then(function() {
                    return self._mergeResolvedConflicts(syncData.conflicts, syncData.contentTypesSyncData);
                })
                .then(function() {
                    return syncData.contentTypesSyncData;
                });
        },

        isSynchronizing: function() {
            return this._isSynchronizing;
        },

        _fireSyncStart: function() {
            var self = this;

            return new rsvp.Promise(function(resolve) {
                if (!self._isSynchronizing) {
                    self._isSynchronizing = true;
                    self._everlive._emitter.emit(constants.Events.SyncStart);
                    resolve();
                } else {
                    resolve();
                }
            });
        },

        _fireSyncEnd: function() {
            this._isSynchronizing = false;
            this._everlive._emitter.emit(constants.Events.SyncEnd, this._syncResultInfo);
            delete this._syncResultInfo;
        },

        _eachSyncItem: function(items, getFilterFunction, contentTypeName, operation) {
            var self = this;

            _.each(items, function(item) {
                var itemFilter = getFilterFunction(item.remoteItem);
                // if we already have an error for this item we do not want to try and sync it again
                var resultItem = item.resultingItem;
                var isCustom = item.isCustom;
                var resolutionType = item.resolutionType;
                if (_.some(self._syncResultInfo.failedItems[contentTypeName], {
                        itemId: resultItem.Id
                    })) {
                    return;
                }

                operation(resultItem, itemFilter, isCustom, resolutionType);
            });
        },

        _shouldAutogenerateIdForContentType: function(collectionName) {
            return this._queryProcessor._shouldAutogenerateIdForContentType(collectionName);
        },

        _addCreatedFileToSyncPromises: function(resultingItemsForCreate, syncPromises, collectionName) {
            var self = this;

            _.each(resultingItemsForCreate, function(item) {
                var filesCollection = self._everlive.files;
                syncPromises[item.Id] = new rsvp.Promise(function(resolve, reject) {
                    self.files.getOfflineLocation(item.Id)
                        .then(function(location) {
                            if (location) {
                                return self._transferFile(false, item, location);
                            }
                        }, function(err) {
                            reject({
                                type: offlineItemStates.created,
                                items: item,
                                contentType: collectionName,
                                error: err,
                                storage: syncLocation.server
                            });
                        })
                        .then(function(res) {
                            var mergedWithServerResponseItem = _.extend({}, item, res.result);
                            self._onItemProcessed(mergedWithServerResponseItem, collectionName, syncLocation.server, offlineItemStates.created);
                            return filesCollection
                                .isSync(true)
                                .useOffline(true)
                                .updateSingle(mergedWithServerResponseItem);
                        }, function(err) {
                            reject({
                                type: offlineItemStates.created,
                                items: item,
                                contentType: collectionName,
                                error: err,
                                storage: syncLocation.server
                            });
                        })
                        .then(resolve, function(err) {
                            reject({
                                type: offlineItemStates.modified,
                                items: item,
                                contentType: collectionName,
                                error: err,
                                storage: syncLocation.client
                            });
                        });
                });
            });
        },

        _transferFile: function(isUpdate, item, location) {
            var sdk = this._everlive;

            return new rsvp.Promise(function(resolve, reject) {
                var self = this;
                var uploadUrl = sdk.files.getUploadUrl();
                var fileExistsPromise = utils.successfulPromise();

                if (isUpdate) {
                    fileExistsPromise = new rsvp.Promise(function(resolve) {
                        sdk.files
                            .isSync(true)
                            .applyOffline(false)
                            .getById(item.Id)
                            .then(function() {
                                resolve(true);
                            })
                            .catch(function() {
                                resolve(false);
                            });
                    });
                }

                fileExistsPromise.then(function(fileExistsOnServer) {
                    var canUpdate = isUpdate && fileExistsOnServer;
                    if (canUpdate) {
                        uploadUrl += '/' + item.Id + '/Content';
                    }

                    var fileTransfer = new FileTransfer();
                    var fileKey = constants.fileUploadKey;
                    var options = {
                        fileKey: fileKey,
                        httpMethod: canUpdate ? 'PUT' : 'POST',
                        mimeType: item.ContentType,
                        fileName: item.Filename,
                        headers: sdk.buildAuthHeader()
                    };

                    options.params = {};

                    _.each(item, function(value, key) {
                        if (key.toLowerCase() !== 'base64') {
                            var prefixedKey = constants.fileUploadKey + constants.fileUploadDelimiter + key;
                            options.params[prefixedKey] = value;
                        }
                    });

                    fileTransfer.upload(location, uploadUrl, function(result) {
                        var parsedResult = utils.parseUtilities.parseJSON(result.response);
                        if (parsedResult.Result === false) {
                            reject.apply(self, arguments);
                        } else if (_.isArray(parsedResult.Result)) {
                            resolve({
                                result: parsedResult.Result[0]
                            })
                        } else {
                            resolve(parsedResult);
                        }
                    }, reject, options, true);
                });
            });
        },

        _addCreatedObjectToSyncPromises: function(syncPromises, dataCollection, resultingItemsForCreate, contentTypeData, collectionName, ids) {
            var self = this;

            var promise = new rsvp.Promise(function(resolve, reject) {
                dataCollection
                    .isSync(true)
                    .applyOffline(false)
                    .create(resultingItemsForCreate)
                    .then(function(res) {
                        resultingItemsForCreate = _.map(resultingItemsForCreate, function(item, index) {
                            item.Id = res.result[index].Id;
                            item.CreatedAt = item.ModifiedAt = res.result[index].CreatedAt;
                            var resultingItem = _.find(contentTypeData.createdItems, function(createdItem) {
                                return createdItem.resultingItem.Id === item.Id;
                            });

                            if (resultingItem.isCustom) {
                                self._onItemProcessed(item, collectionName, syncLocation.client, offlineItemStates.modified);
                            }

                            return item;
                        });
                    }, function(err) {
                        const error = err.error || err;
                        throw {
                            type: offlineItemStates.created,
                            items: resultingItemsForCreate,
                            contentType: collectionName,
                            error: error,
                            storage: syncLocation.server
                        };
                    })
                    .then(function() {
                        return dataCollection
                            .isSync(true)
                            .useOffline(true)
                            .create(resultingItemsForCreate)
                            .then(function() {
                                _.each(resultingItemsForCreate, function(createdItem) {
                                    self._onItemProcessed(createdItem, collectionName, syncLocation.server,
                                        offlineItemStates.created);
                                });
                            }, function(err) {
                                throw {
                                    type: offlineItemStates.created,
                                    items: resultingItemsForCreate,
                                    contentType: collectionName,
                                    error: err,
                                    storage: syncLocation.client
                                };
                            });
                    })
                    .then(function() {
                        if (ids && ids.length) {
                            var filter = {
                                Id: {
                                    $in: ids
                                }
                            };
                            return dataCollection
                                .isSync(true)
                                .useOffline(true)
                                .destroy(filter)
                                .catch(function(err) {
                                    throw {
                                        type: offlineItemStates.created,
                                        items: resultingItemsForCreate,
                                        contentType: collectionName,
                                        error: err,
                                        storage: syncLocation.client
                                    };
                                });
                        }
                    })
                    .then(resolve)
                    .catch(function(err) {
                        reject(err);
                    });
            });

            _.each(resultingItemsForCreate, function(item) {
                syncPromises[item.Id] = promise;
            });

            return resultingItemsForCreate;
        },

        _addCreatedItemsForSync: function(contentTypeData, syncPromises, dataCollection) {
            var collectionName = dataCollection.collectionName;

            var resultingItemsForCreate = _.pluck(contentTypeData.createdItems, 'resultingItem');
            var ids;
            if (!this._shouldAutogenerateIdForContentType(collectionName)) {
                ids = _.pluck(resultingItemsForCreate, 'Id');
                resultingItemsForCreate = offlineTransformations.removeIdTransform(resultingItemsForCreate);
            }

            if (utils.isContentType.files(collectionName)) {
                return this._addCreatedFileToSyncPromises(resultingItemsForCreate, syncPromises, collectionName);
            } else {
                return this._addCreatedObjectToSyncPromises(syncPromises, dataCollection, resultingItemsForCreate, contentTypeData, collectionName, ids);
            }
        },

        _addUpdatedItemsForSync: function(contentTypeData, getFilterOperation, syncPromises, dataCollection, itemUpdateOperation) {
            var self = this;
            var collectionName = dataCollection.collectionName;
            self._eachSyncItem(contentTypeData.modifiedItems, getFilterOperation, collectionName, itemUpdateOperation);
        },

        _addDeletedItemsForSync: function(contentTypeData, getFilterOperation, syncPromises, dataCollection, itemDeleteOperation) {
            var self = this;

            var collectionName = dataCollection.collectionName;
            self._eachSyncItem(contentTypeData.deletedItems, getFilterOperation, collectionName, itemDeleteOperation);
        },

        _onSyncResponse: function(res, item, collectionName, operation, isCustomItem) {
            var self = this;

            if (res.result !== 1) {
                return new rsvp.Promise(function(resolve, reject) {
                    reject(_.extend({}, EverliveErrors.syncConflict, {
                        contentType: collectionName
                    }));
                });
            } else {
                if (operation === DataQuery.operations.Update) {
                    self._onItemProcessed(item, collectionName, syncLocation.server, offlineItemStates.modified);
                    var updatedItem = _.extend({}, item, {
                        ModifiedAt: res.ModifiedAt
                    });

                    //TODO: use the new way of building DataQueries

                    var updateQuery = new DataQuery({
                        operation: operation,
                        data: updatedItem,
                        additionalOptions: {
                            id: item.Id
                        },
                        meta: {
                            collectionName: collectionName,
                        },
                        isSync: true
                    });

                    return this.processQuery(updateQuery)
                        .then(function() {
                            if (isCustomItem) {
                                var existingItem = _.find(self._syncResultInfo.syncedItems[collectionName], function(syncedItem) {
                                    return syncedItem.itemId === item.Id;
                                });

                                if (!existingItem) {
                                    self._onItemProcessed(item, collectionName, syncLocation.client, offlineItemStates.modified);
                                }
                            }
                        });
                } else if (operation === DataQuery.operations.Delete) {
                    self._onItemProcessed(item, collectionName, syncLocation.server, offlineItemStates.deleted);
                    return this._purgeById(collectionName, item.Id)
                        .then(function() {
                            if (isCustomItem) {
                                self._onItemProcessed(item, collectionName, syncLocation.client, offlineItemStates.deleted);
                            }
                        });
                }
            }
        },

        _purgeById: function(contentType, itemId) {
            var self = this;

            return this._queryProcessor._getCollection(contentType)
                .then(function(collection) {
                    delete collection[itemId];
                    return self._queryProcessor._persistData(contentType);
                });
        },

        sync: function() {
            var self = this;
            self._syncResultInfo = self._syncResultInfo || {
                syncedItems: {},
                syncedToServer: 0,
                syncedToClient: 0,
                failedItems: {},
                error: undefined // added for visibility
            };

            if (!this.isOnline()) {
                throw new EverliveError('Cannot synchronize while offline');
            }

            self._fireSyncStart()
                .then(function() {
                    return self._applySync();
                })
                .then(function(syncResults) {
                    var conflictsWhileSync = [];
                    _.each(syncResults, function(syncResult, itemId) {
                        if (syncResult && syncResult.state === 'rejected') {
                            if (syncResult.reason && syncResult.reason.code === EverliveErrors.syncConflict.code) {
                                conflictsWhileSync.push(syncResult);
                            } else {
                                // to save time and traffic we are using a single create request for all items
                                // this is why if there is an error we need to split the items we tried to create
                                // and set the same error for all items.
                                self._onItemFailed(syncResult, itemId);
                            }
                        }
                    });

                    if (conflictsWhileSync.length) {
                        return self.sync();
                    } else {
                        self._fireSyncEnd();
                    }
                })
                .catch(function(err) {
                    if (!err) {
                        err = new EverliveError(EverliveErrors.syncErrorUnknown);
                    }
                    self._syncResultInfo.error = err;
                    self._fireSyncEnd();
                });
        },

        _handleKeepServer: function(typeName, conflictingItem, offlineSyncOperations, contentTypeSyncData) {
            var self = this;

            var serverItem = conflictingItem.serverItem;
            var clientItem = conflictingItem.clientItem;
            var syncQuery;
            if (serverItem && clientItem) {
                // update the item offline
                syncQuery = new DataQuery({
                    meta: {
                        collectionName: typeName,
                    },
                    operation: DataQuery.operations.Update,
                    additionalOptions: {
                        id: serverItem.Id
                    },
                    data: serverItem
                });
            } else if (serverItem && !clientItem) {
                // create item offline
                syncQuery = new DataQuery({
                    meta: {
                        collectionName: typeName,
                    },
                    operation: DataQuery.operations.Create,
                    data: serverItem
                });
            } else if (!serverItem && clientItem) {
                // delete item offline
                syncQuery = new DataQuery({
                    meta: {
                        collectionName: typeName,
                    },
                    operation: DataQuery.operations.DeleteById,
                    additionalOptions: {
                        id: clientItem.Id
                    }
                });
            } else {
                throw new EverliveError('Both serverItem and clientItem are not set when syncing data with "KeepServer" resolution strategy.');
            }

            syncQuery.isSync = true;
            offlineSyncOperations.push(new rsvp.Promise(function(resolve, reject) {
                self.processQuery(syncQuery)
                    .then(function() {
                        switch (syncQuery.operation) {
                            case DataQuery.operations.Update:
                                self._onItemProcessed(serverItem, typeName, syncLocation.client, offlineItemStates.modified);
                                // the files content type is special and needs to enable the file contents offline, so we cannot only
                                // update the data
                                if (utils.isContentType.files(typeName)) {
                                    contentTypeSyncData.modifiedItems.push({
                                        remoteItem: conflictingItem.serverItem,
                                        resultingItem: serverItem,
                                        resolutionType: constants.ConflictResolution.KeepServer
                                    });
                                }
                                break;
                            case DataQuery.operations.Create:
                                self._onItemProcessed(serverItem, typeName, syncLocation.client, offlineItemStates.created);
                                break;
                            case DataQuery.operations.DeleteById:
                                self._onItemProcessed(clientItem, typeName, syncLocation.client, offlineItemStates.deleted);
                                break;
                        }
                        resolve();
                    }, function(err) {
                        var itemId;
                        var operation;
                        switch (syncQuery.operation) {
                            case DataQuery.operations.Update:
                                itemId = serverItem.Id;
                                operation = offlineItemStates.modified;
                                break;
                            case DataQuery.operations.Create:
                                itemId = serverItem.Id;
                                operation = offlineItemStates.created;
                                break;
                            case DataQuery.operations.DeleteById:
                                itemId = clientItem.Id;
                                operation = offlineItemStates.deleted;
                                break;
                        }

                        reject({
                            itemId: itemId,
                            type: operation,
                            contentType: syncQuery.collectionName,
                            error: err,
                            storage: syncLocation.client
                        })
                    })
            }));
        },

        _handleKeepClient: function(conflictingItem, contentTypeSyncData) {
            var serverItem = conflictingItem.serverItem;
            var clientItem = conflictingItem.clientItem;
            var resultingItem;
            var collection;

            if (serverItem && clientItem) {
                resultingItem = _.extend(clientItem, {
                    ModifiedAt: new Date(serverItem.ModifiedAt)
                });
                collection = contentTypeSyncData.modifiedItems;
            } else if (serverItem && !clientItem) {
                resultingItem = serverItem;
                collection = contentTypeSyncData.deletedItems;
            } else if (!serverItem && clientItem) {
                resultingItem = clientItem;
                collection = contentTypeSyncData.createdItems;
            } else {
                throw new EverliveError('Both serverItem and clientItem are not set when syncing data with "KeepClient" resolution strategy.');
            }

            collection.push({
                remoteItem: conflictingItem.serverItem,
                resultingItem: resultingItem,
                resolutionType: constants.ConflictResolution.KeepClient
            });
        },

        _handleCustom: function(conflictingItem, typeName, offlineSyncOperations, contentTypeSyncData) {
            var serverItem = conflictingItem.serverItem;
            var clientItem = conflictingItem.clientItem;
            var customItem = _.omit(conflictingItem.result.item, 'CreatedAt', 'ModifiedAt');
            if (serverItem && customItem) {
                var createItemOfflineQuery = new DataQuery({
                    meta: {
                        collectionName: typeName
                    },
                    operation: DataQuery.operations.Create,
                    data: serverItem // create the server item offline and it will be updated when sync finishes
                });

                createItemOfflineQuery.preserveState = true;
                createItemOfflineQuery.isSync = true;

                offlineSyncOperations.push(this.processQuery(createItemOfflineQuery));

                this._onItemProcessed(serverItem, typeName, syncLocation.client, offlineItemStates.created);
            }

            if (serverItem && customItem && !clientItem) {
                customItem.Id = serverItem.Id;
                contentTypeSyncData.modifiedItems.push({
                    remoteItem: serverItem,
                    resultingItem: customItem,
                    isCustom: true
                });
            } else if (serverItem && !customItem) {
                contentTypeSyncData.deletedItems.push({
                    remoteItem: conflictingItem.serverItem,
                    resultingItem: serverItem,
                    isCustom: true
                });
            } else if (!serverItem && customItem && clientItem) {
                var updateItemOfflineQuery = new DataQuery({
                    meta: {
                        collectionName: typeName
                    },
                    operation: DataQuery.operations.Update,
                    data: customItem,
                    additionalOptions: {
                        id: clientItem.Id
                    }
                });

                offlineSyncOperations.push(this.processQuery(updateItemOfflineQuery));
                customItem.Id = clientItem.Id;

                contentTypeSyncData.createdItems.push({
                    remoteItem: serverItem,
                    resultingItem: customItem,
                    isCustom: true
                });
            } else {
                customItem.Id = serverItem.Id;
                contentTypeSyncData.modifiedItems.push({
                    remoteItem: serverItem,
                    resultingItem: customItem,
                    isCustom: true
                });
            }
        },

        _mergeResolvedConflicts: function(conflicts, syncData) {
            var self = this;

            var offlineSyncOperations = [];
            _.each(conflicts, function(conflict) {
                var typeName = conflict.contentTypeName;
                _.each(conflict.conflictingItems, function(conflictingItem) {
                    var contentTypeSyncData = syncData[typeName];
                    switch (conflictingItem.result.resolutionType) {
                        case constants.ConflictResolution.KeepServer:
                            self._handleKeepServer(typeName, conflictingItem, offlineSyncOperations, contentTypeSyncData);
                            break;
                        case constants.ConflictResolution.KeepClient:
                            self._handleKeepClient(conflictingItem, contentTypeSyncData);
                            break;
                        case constants.ConflictResolution.Custom:
                            if (utils.isContentType.files(typeName)) {
                                var err = EverliveErrors.customFileSyncNotSupported;
                                throw new EverliveError(err.message, err.code);
                            }

                            self._handleCustom(conflictingItem, typeName, offlineSyncOperations, contentTypeSyncData);
                            break;
                        case constants.ConflictResolution.Skip:
                            break;
                    }
                });
            });

            return rsvp.all(offlineSyncOperations);
        },

        _getSyncItemStates: function(contentType, offlineItems, serverItems) {
            var self = this;

            var contentTypeSyncData = {
                itemsForSync: {
                    createdItems: [],
                    modifiedItems: [],
                    modifiedItemsOnServer: [],
                    deletedItems: [],
                    deletedItemsOnServer: []
                },
                conflicts: {
                    contentTypeName: contentType,
                    conflictingItems: []
                }
            };

            _.each(offlineItems, function(offlineItem) {
                var serverItem = _.findWhere(serverItems, {
                    Id: offlineItem.Id
                });
                if (serverItem) {
                    if (serverItem.Id === offlineItem.Id && offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.created) {
                        if (self.setup.conflicts.strategy === constants.ConflictResolutionStrategy.Custom) {
                            self._onItemFailed({
                                type: offlineItemStates.modified,
                                storage: syncLocation.client,
                                error: new EverliveError(EverliveErrors.syncError),
                                contentType: contentType
                            }, offlineItem.Id);

                            return self._onItemFailed({
                                type: offlineItemStates.modified,
                                storage: syncLocation.server,
                                error: new EverliveError(EverliveErrors.syncError),
                                contentType: contentType
                            }, serverItem.Id);
                        } else {
                            return self._onItemFailed({
                                type: offlineItemStates.created,
                                storage: syncLocation.client,
                                error: new EverliveError(EverliveErrors.syncError),
                                contentType: contentType
                            }, serverItem.Id);
                        }
                    }

                    var clientItemChanged = !!offlineItem[constants.offlineItemsStateMarker];
                    var hasUpdateConflict = false;

                    if (clientItemChanged) {
                        hasUpdateConflict = serverItem.ModifiedAt.getTime() !== offlineItem.ModifiedAt.getTime() || offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.deleted;
                        //TODO: when an item is removed offline its ModifiedAt field is not set, check if it needs to be set or we can use this
                    }

                    if (hasUpdateConflict) {
                        contentTypeSyncData.conflicts.conflictingItems.push({
                            // if the item was modified on the server and deleted locally we have a conflict and set the client item to null
                            // otherwise it is a simple modification conflict
                            clientItem: offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.deleted ? null : offlineItem,
                            serverItem: serverItem,
                            result: {}
                        });
                    } else {
                        if (offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.deleted) {
                            contentTypeSyncData.itemsForSync.deletedItems.push({
                                remoteItem: serverItem,
                                resultingItem: offlineItem
                            });
                        } else if (offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.modified) {
                            contentTypeSyncData.itemsForSync.modifiedItems.push({
                                remoteItem: serverItem,
                                resultingItem: offlineItem
                            });
                        } else if (offlineItem[constants.offlineItemsStateMarker] === undefined) {
                            contentTypeSyncData.itemsForSync.modifiedItemsOnServer.push(serverItem);
                        } else {
                            contentTypeSyncData.itemsForSync.modifiedItems.push({
                                remoteItem: serverItem,
                                resultingItem: serverItem
                            });
                        }
                    }
                } else {
                    // if the item in memory has been modified, but the item on the server has been deleted
                    if (offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.modified) {
                        contentTypeSyncData.conflicts.conflictingItems.push({
                            clientItem: offlineItem,
                            serverItem: null,
                            result: {}
                        });
                    } else if (offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.created) {
                        contentTypeSyncData.itemsForSync.createdItems.push({
                            remoteItem: serverItem,
                            resultingItem: offlineItem
                        });
                    } else {
                        contentTypeSyncData.itemsForSync.deletedItemsOnServer.push(offlineItem);
                    }
                }

                delete offlineItem[constants.offlineItemsStateMarker];
            });

            return contentTypeSyncData;
        },

        _setResolutionTypeForItem: function(resolutionType, conflictingItem) {
            conflictingItem.result = {
                resolutionType: resolutionType
            };
        },

        _applyResolutionStrategy: function(conflicts) {
            var self = this;
            var conflictResolutionStrategy = self.setup.conflicts.strategy;
            return new rsvp.Promise(function(resolve, reject) {
                var conflictResolutionPromises = [];

                for (var i = 0; i < conflicts.length; i++) {
                    var conflict = conflicts[i];
                    if (conflict.conflictingItems.length) {
                        switch (conflictResolutionStrategy) {
                            case constants.ConflictResolutionStrategy.ServerWins:
                                _.each(conflict.conflictingItems,
                                    self._setResolutionTypeForItem.bind(self, constants.ConflictResolution.KeepServer));
                                break;
                            case constants.ConflictResolutionStrategy.Custom:
                                var customStrategy = self.setup.conflicts.implementation;
                                if (!customStrategy) {
                                    return reject(new EverliveError('Implementation of the conflict resolution strategy ' +
                                        'must be provided when set to Custom'));
                                }

                                conflictResolutionPromises.push(new rsvp.Promise(function(resolve) {
                                    customStrategy(conflicts, resolve)
                                }));
                                break;
                            default:
                                return reject(new EverliveError('Invalid resolution strategy provided'));
                        }
                    }
                }

                rsvp.all(conflictResolutionPromises)
                    .then(function() {
                        resolve();
                    });
            });
        },

        _getSyncPromiseBatch: function(contentType, batchIds) {
            var self = this;
            
            var dataQuery = new DataQuery({
                meta: {
                    collectionName: contentType
                },
                query: new Query({
                    'Id': {
                        '$in': batchIds
                    }
                }),
                operation: DataQuery.operations.Read,
                applyOffline: false
            });

            var getRequestOptionsFromQuery = RequestOptionsBuilder[dataQuery.operation];
            var requestOptions = getRequestOptionsFromQuery(dataQuery);
            var request = new Request(self._everlive.setup, requestOptions);

            return RequestService.sendRequest(request);
        },

        _getPlainItemsForSync: function(collection, forceDirty) {
            if (this.setup.syncUnmodified && !forceDirty) {
                return _.values(collection);
            } else {
                return this._queryProcessor._getDirtyItems(collection);
            }
        },

        _getIdsForSync: function(contentType, offlineItemsToSync) {
            if (this._shouldAutogenerateIdForContentType(contentType)) {
                return _.pluck(offlineItemsToSync, '_id');
            } else {
                return _.pluck(_.reject(offlineItemsToSync, function(offlineItem) {
                    return offlineItem[constants.offlineItemsStateMarker] === offlineItemStates.created;
                }), '_id');
            }
        },

        _getSyncPromiseForCollection: function(collection, contentType) {
            var batches = [];
            var batchSize = constants.syncBatchSize;

            var offlineItemsToSync = this._getPlainItemsForSync(collection);
            var allIdsForSync = this._getIdsForSync(contentType, offlineItemsToSync);

            var batchCount = Math.ceil(allIdsForSync.length / batchSize);

            for (var i = 0; i < batchCount; i++) {
                var batchSkipSize = i * batchSize;
                var batchIds = allIdsForSync.slice(batchSkipSize, batchSkipSize + batchSize);
                var syncGetServerItemsPromise = this._getSyncPromiseBatch(contentType, batchIds);
                batches.push(syncGetServerItemsPromise);
            }

            return rsvp.all(batches)
                .then(function(serverItemsSyncResponses) {
                    var result = {
                        serverItems: []
                    };

                    _.each(serverItemsSyncResponses, function(serverItems) {
                        result.serverItems = _.union(result.serverItems, serverItems);
                    });

                    result.offlineItemsToSync = offlineItemsToSync;
                    return result;
                });
        },

        _onItemFailed: function(syncResult, itemId) {
            var self = this;

            var results = syncResult.reason ? syncResult.reason : syncResult;
            var targetType = results.contentType;

            var getFailedItem = function(id) {
                var pickedObject = _.pick(results, 'storage', 'type', 'error');
                if (!pickedObject.error) {
                    pickedObject.error = new EverliveError(EverliveErrors.syncErrorUnknown);
                }
                return _.extend({
                    itemId: id,
                    contentType: targetType
                }, pickedObject);
            };

            var failedItems = [];
            if (results.type === offlineItemStates.created && results.items) {
                failedItems = _.map(results.items, function(item) {
                    return getFailedItem(item.Id);
                });
            } else {
                failedItems.push(getFailedItem(itemId));
            }

            self._syncResultInfo.failedItems[targetType] = self._syncResultInfo.failedItems[targetType] || [];
            _.each(failedItems, function(failedItem) {
                self._syncResultInfo.failedItems[targetType].push(failedItem);
                self._fireItemProcessed(failedItem);
            });
        },

        _onItemProcessed: function(item, contentType, syncStorage, syncType) {
            var syncInfo = {
                itemId: item.Id,
                type: syncType,
                storage: syncStorage,
                contentType: contentType
            };

            this._syncResultInfo.syncedItems[contentType] = this._syncResultInfo.syncedItems[contentType] || [];
            this._syncResultInfo.syncedItems[contentType].push(syncInfo);

            if (syncInfo.storage == syncLocation.server) {
                this._syncResultInfo.syncedToServer++;
            } else {
                this._syncResultInfo.syncedToClient++;
            }

            this._fireItemProcessed(syncInfo);
        },

        _fireItemProcessed: function(syncInfo) {
            this._everlive._emitter.emit(constants.Events.ItemProcessed, syncInfo);
        },

        _getClientWinsSyncData: function(collections, forceDirty) {
            var self = this;
            var syncData = {};
            _.each(collections, function(collection, typeName) {
                if (!syncData[typeName]) {
                    syncData[typeName] = {
                        createdItems: [],
                        modifiedItems: [],
                        deletedItems: [],
                        deletedItemsOnServer: [],
                        modifiedItemsOnServer: []
                    };
                }

                var plainItems = self._getPlainItemsForSync(collection, forceDirty);
                var itemsForSync = offlineTransformations.idTransform(plainItems);

                _.each(itemsForSync, function(itemForSync) {
                    switch (itemForSync[constants.offlineItemsStateMarker]) {
                        case offlineItemStates.created:
                            syncData[typeName].createdItems.push({
                                remoteItem: itemForSync,
                                resultingItem: itemForSync
                            });
                            break;
                        case offlineItemStates.modified:
                            syncData[typeName].modifiedItems.push({
                                remoteItem: itemForSync,
                                resultingItem: itemForSync
                            });
                            break;
                        case offlineItemStates.deleted:
                            syncData[typeName].deletedItems.push({
                                remoteItem: itemForSync,
                                resultingItem: itemForSync
                            });
                            break;
                    }

                    delete itemForSync[constants.offlineItemsStateMarker];
                });
            });

            return syncData;
        },

        _getModifiedFilesForSyncClientWins: function(itemId, item, collectionName) {
            var self = this;
            var sdk = self._everlive;

            return new rsvp.Promise(function(resolve, reject) {
                var offlineFiles = self.files;
                offlineFiles.getOfflineLocation(itemId)
                    .then(function(location) {
                        if (location) {
                            return self._transferFile(true, item, location)
                                .then(function(result) {
                                    if (result.Result === false) {
                                        reject({
                                            type: offlineItemStates.modified,
                                            itemId: item.Id,
                                            contentType: collectionName,
                                            error: result,
                                            storage: syncLocation.server
                                        });
                                    } else {
                                        return {
                                            result: result
                                        };
                                    }
                                }, function(err) {
                                    reject({
                                        type: offlineItemStates.modified,
                                        itemId: item.Id,
                                        contentType: collectionName,
                                        error: err,
                                        storage: syncLocation.server
                                    });
                                });
                        } else {
                            return sdk.files
                                .isSync(true)
                                .applyOffline(false)
                                .updateSingle(item)
                                .then(function(response) {
                                    return response;
                                }, function(err) {
                                    reject({
                                        type: offlineItemStates.modified,
                                        itemId: item.Id,
                                        contentType: collectionName,
                                        error: err,
                                        storage: syncLocation.server
                                    });
                                });
                        }
                    })
                    .then(function(onlineResponse) {
                        var onlineResult = onlineResponse.result;
                        item.ModifiedAt = onlineResult.ModifiedAt;
                        self._onItemProcessed(item, collectionName, syncLocation.server, offlineItemStates.modified);
                        return sdk.files
                            .isSync(true)
                            .useOffline(true)
                            .updateSingle(item);
                    })
                    .then(resolve)
                    .catch(function(err) {
                        reject({
                            type: offlineItemStates.modified,
                            itemId: item.Id,
                            contentType: collectionName,
                            error: err,
                            storage: syncLocation.server
                        });
                    });
            });
        },

        _getModifiedItemForSyncClientWins: function(dataCollection, item, collectionName) {
            var self = this;

            return new rsvp.Promise(function(resolve, reject) {
                return dataCollection
                    .isSync(true)
                    .applyOffline(false)
                    .updateSingle(item)
                    .then(function(res) {
                        self._onItemProcessed(item, collectionName, syncLocation.server, offlineItemStates.modified);
                        var updatedItem = _.extend({}, item, {
                            ModifiedAt: res.ModifiedAt
                        });

                        var updateQuery = new DataQuery({
                            operation: DataQuery.operations.Update,
                            data: updatedItem,
                            additionalOptions: {
                                id: item.Id
                            },
                            meta: {
                                collectionName: collectionName
                            },
                            isSync: true
                        });

                        return self.processQuery(updateQuery);
                    }, function(res) {
                        reject({
                            storage: syncLocation.server,
                            type: offlineItemStates.modified,
                            itemId: item.Id,
                            contentType: collectionName,
                            error: res
                        });
                    })
                    .then(resolve, function(err) {
                        reject({
                            storage: syncLocation.client,
                            type: offlineItemStates.modified,
                            itemId: item.Id,
                            contentType: collectionName,
                            error: err
                        });
                    });
            });
        },

        _addModifiedItemsForSyncClientWins: function(contentTypeData, syncPromises, dataCollection) {
            var self = this;

            this._addUpdatedItemsForSync(contentTypeData, getSyncFilterNoModifiedAt, syncPromises, dataCollection, function(item) {
                var itemId = item.Id;
                if (!itemId) {
                    throw new EverliveError('When updating an item it must have an Id field.');
                }
                var collectionName = dataCollection.collectionName;

                if (utils.isContentType.files(collectionName)) {
                    syncPromises[itemId] = self._getModifiedFilesForSyncClientWins(itemId, item, collectionName);
                } else {
                    syncPromises[itemId] = self._getModifiedItemForSyncClientWins(dataCollection, item, collectionName);
                }
            });
        },

        _addDeletedItemsForSyncClientWins: function(contentTypeData, syncPromises, dataCollection) {
            var self = this;

            this._addDeletedItemsForSync(contentTypeData, getSyncFilterNoModifiedAt, syncPromises, dataCollection,
                function(item, itemFilter) {
                    var collectionName = dataCollection.collectionName;
                    syncPromises[item.Id] = new rsvp.Promise(function(resolve, reject) {
                        var itemId = item.Id;
                        if (!itemId) {
                            throw new EverliveError('When deleting an item it must have an Id field.');
                        }

                        return dataCollection
                            .isSync(true)
                            .applyOffline(false)
                            .destroySingle(itemFilter)
                            .then(function() {
                                self._onItemProcessed(item, collectionName, syncLocation.server, offlineItemStates.deleted);
                                return self._purgeById(collectionName, item.Id).then(function() {
                                    resolve();
                                }, function(err) {
                                    reject(_.extend({}, {
                                        storage: syncLocation.client,
                                        type: offlineItemStates.deleted,
                                        contentType: collectionName,
                                        itemId: itemId,
                                        error: err
                                    }));
                                });
                            }, function(err) {
                                reject(_.extend({}, {
                                    storage: syncLocation.server,
                                    type: offlineItemStates.deleted,
                                    contentType: collectionName,
                                    error: err,
                                    itemId: itemId
                                }));
                            });
                    });
                });
        },

        _applyClientWins: function(collections) {
            var self = this;
            var syncData = this._getClientWinsSyncData(collections, true);
            var syncPromises = {};

            _.each(syncData, function(contentTypeData, typeName) {
                var dataCollection = self._everlive.data(typeName);
                if (contentTypeData.createdItems.length) {
                    self._addCreatedItemsForSync(contentTypeData, syncPromises, dataCollection);
                }

                if (contentTypeData.modifiedItems.length) {
                    self._addModifiedItemsForSyncClientWins(contentTypeData, syncPromises, dataCollection);
                }

                if (contentTypeData.deletedItems.length) {
                    self._addDeletedItemsForSyncClientWins(contentTypeData, syncPromises, dataCollection);
                }
            });

            var syncResult;

            return rsvp.hashSettled(syncPromises)
                .then(function(result) {
                    syncResult = result;
                    if (self.setup.syncUnmodified) {
                        var promises = [];
                        _.each(collections, function(collection, collectionName) {
                            var allOfflineItems = self._getPlainItemsForSync(collection);
                            var itemsToDownload = _.where(allOfflineItems, function(offlineItem) {
                                return offlineItem[constants.offlineItemsStateMarker] !== undefined;
                            });

                            var DataCollection = self._everlive.data(collectionName);

                            var itemIdsForSync = _.pluck(itemsToDownload, '_id');
                            var downloadPromise = DataCollection
                                .isSync(true)
                                .useOffline(false)
                                .get({
                                    Id: {
                                        $in: itemIdsForSync
                                    }
                                })
                                .then(function(res) {
                                    var serverItems = res.result;
                                    var serverItemIds = _.pluck(serverItems, 'Id');
                                    return self._unmodifiedClientWinsItemsDeletedOnServer(collectionName, serverItemIds, itemsToDownload)
                                        .then(function() {
                                            return self._unmodifiedClientWinsItemsUpdatedOnServer(collectionName, serverItems, itemsToDownload);
                                        });
                                });

                            promises.push(downloadPromise);
                        });

                        return rsvp.all(promises);
                    }
                })
                .then(function() {
                    return syncResult;
                });
        },

        _unmodifiedClientWinsItemsDeletedOnServer: function(collectionName, serverItemIds, clientItems) {
            var self = this;
            var itemsForDeleteIds = [];
            var itemIdsForSync = _.pluck(clientItems, '_id');
            _.each(itemIdsForSync, function(itemId) {
                if (serverItemIds.indexOf(itemId) === -1) {
                    itemsForDeleteIds.push(itemId);
                }
            });

            return utils.successfulPromise()
                .then(function() {
                    if (itemsForDeleteIds.length !== 0) {
                        var deleteQuery = new DataQuery({
                            operation: DataQuery.operations.Delete,
                            filter: {
                                Id: {
                                    $in: itemsForDeleteIds
                                }
                            },
                            meta: {
                                collectionName: collectionName
                            },
                            isSync: true
                        });

                        return self.processQuery(deleteQuery).then(function() {
                            _.each(itemsForDeleteIds, function(itemsForDeleteId) {
                                self._onItemProcessed({Id: itemsForDeleteId}, collectionName, syncLocation.client, offlineItemStates.deleted);
                            });
                        });
                    }
                });
        },

        _unmodifiedClientWinsItemsUpdatedOnServer: function(collectionName, serverItems, clientItems) {
            var self = this;
            var updatePromises = [];

            _.each(serverItems, function(serverItem) {
                var item = _.find(clientItems, function(clientItem) {
                    return clientItem._id === serverItem.Id;
                });

                if (item) {
                    var updateQuery = new DataQuery({
                        operation: DataQuery.operations.Update,
                        data: serverItem,
                        additionalOptions: {
                            id: item._id
                        },
                        meta: {
                            collectionName: collectionName
                        },
                        isSync: true
                    });

                    var itemUpdatedPromise = self.processQuery(updateQuery)
                        .then(function(res) {
                            self._onItemProcessed(serverItem, collectionName, syncLocation.client, offlineItemStates.modified);
                        });

                    updatePromises.push(itemUpdatedPromise);
                }
            });

            return rsvp.all(updatePromises);
        },

        _modifyFileStandardSync: function(syncPromises, itemId, item, collectionName, resolutionType) {
            var self = this;

            var filesCollection = self._everlive.files;
            syncPromises[itemId] = new rsvp.Promise(function(resolve, reject) {
                var offlineLocation;
                self.files.getOfflineLocation(itemId)
                    .then(function(locationOnDisk) {
                        offlineLocation = locationOnDisk;
                    })
                    .then(function() {
                        return filesCollection
                            .isSync(true)
                            .applyOffline(false)
                            .getById(itemId);
                    })
                    .then(function(response) {
                        var file = response.result;
                        if (file.ModifiedAt.getTime() !== item.ModifiedAt.getTime()) {
                            reject(_.extend({}, new EverliveError(EverliveErrors.syncConflict), {
                                contentType: collectionName
                            }));
                        } else {
                            if (offlineLocation) {
                                if (resolutionType === constants.ConflictResolution.KeepServer) {
                                    return self.files._saveFile(item.Uri, item.Filename, item.Id)
                                        .then(function() {
                                            return self._offlineFilesProcessor.purge(offlineLocation);
                                        })
                                        .then(function() {
                                            return response;
                                        });
                                } else if (resolutionType === constants.ConflictResolution.KeepClient) {
                                    return self._transferFile(true, item, offlineLocation);
                                }
                            }
                        }
                    })
                    .then(function() {
                        return self._everlive.files
                            .isSync(true)
                            .useOffline(true)
                            .updateSingle(item);
                    })
                    .then(resolve)
                    .catch(reject);
            });
        },

        _modifyContentTypeStandardSync: function(syncPromises, itemId, dataCollection, item, itemFilter, collectionName, isCustom) {
            var self = this;

            syncPromises[itemId] = dataCollection
                .isSync(true)
                .applyOffline(false)
                .update(item, itemFilter)
                .then(function(res) {
                    return self._onSyncResponse(res, item, collectionName, DataQuery.operations.Update, isCustom);
                }, function(err) {
                    return new rsvp.Promise(function(resolve, reject) {
                        reject({
                            type: offlineItemStates.modified,
                            itemId: item.Id,
                            contentType: collectionName,
                            error: err,
                            storage: syncLocation.server
                        });
                    });
                });
        },

        _applyStandardSync: function(collections) {
            var self = this;

            var promises = {};
            _.each(collections, function(collection, contentType) {
                promises[contentType] = self._getSyncPromiseForCollection(collection, contentType);
            });

            return rsvp.hash(promises)
                .then(function(contentTypes) {
                    return self._prepareSyncData(contentTypes);
                })
                .then(function(syncData) {
                    return self._resolveConflicts(syncData);
                })
                .then(function(contentTypeSyncData) {
                    var syncPromises = {};
                    _.each(contentTypeSyncData, function(contentTypeData, collectionName) {
                        var dataCollection = self._everlive.data(collectionName);
                        if (contentTypeData.createdItems.length) {
                            self._addCreatedItemsForSync(contentTypeData, syncPromises, dataCollection);
                        }

                        if (contentTypeData.modifiedItems.length) {
                            self._addUpdatedItemsForSync(contentTypeData, getSyncFilterForItem, syncPromises, dataCollection, function(item, itemFilter, isCustom, resolutionType) {
                                var itemId = item.Id;

                                if (utils.isContentType.files(collectionName)) {
                                    self._modifyFileStandardSync(syncPromises, itemId, item, collectionName, resolutionType, isCustom);
                                } else {
                                    self._modifyContentTypeStandardSync(syncPromises, itemId, dataCollection, item, itemFilter, collectionName, isCustom);
                                }
                            });
                        }

                        if (contentTypeData.deletedItems.length) {
                            self._addDeletedItemsForSync(contentTypeData, getSyncFilterForItem, syncPromises, dataCollection, function(item, itemFilter, isCustom) {
                                syncPromises[item.Id] = dataCollection
                                    .isSync(true)
                                    .applyOffline(false)
                                    .destroy(itemFilter)
                                    .then(function(res) {
                                        return self._onSyncResponse(res, item, collectionName, DataQuery.operations.Delete, isCustom);
                                    }, function(err) {
                                        return new rsvp.Promise(function(resolve, reject) {
                                            reject({
                                                type: offlineItemStates.deleted,
                                                itemId: item.Id,
                                                contentType: collectionName,
                                                error: err,
                                                storage: syncLocation.server
                                            });
                                        });
                                    });
                            });
                        }

                        _.each(contentTypeData.deletedItemsOnServer, function(item) {
                            syncPromises[item.Id] = dataCollection
                                .isSync(true)
                                .useOffline(true)
                                .destroySingle({
                                    Id: item.Id
                                })
                                .then(function(res) {
                                    return self._onItemProcessed(item, collectionName, syncLocation.client, offlineItemStates.deleted);
                                }, function(err) {
                                    return new rsvp.Promise(function(resolve, reject) {
                                        reject({
                                            type: offlineItemStates.deleted,
                                            itemId: item.Id,
                                            contentType: collectionName,
                                            error: err,
                                            storage: syncLocation.client
                                        });
                                    });
                                });
                        });

                        _.each(contentTypeData.modifiedItemsOnServer, function(item) {
                            syncPromises[item.Id] = dataCollection
                                .isSync(true)
                                .useOffline(true)
                                .update(item, {
                                    Id: item.Id
                                })
                                .then(function(res) {
                                    return self._onItemProcessed(item, collectionName, syncLocation.client, offlineItemStates.modified);
                                }, function(err) {
                                    return utils.rejectedPromise({
                                        type: offlineItemStates.modified,
                                        itemId: item.Id,
                                        contentType: collectionName,
                                        error: err,
                                        storage: syncLocation.client
                                    })
                                })
                        })
                    });

                    return rsvp.hashSettled(syncPromises);
                });
        },

        _applySync: function() {
            var self = this;

            return this._queryProcessor._getAllCollections()
                .then(function(collections) {
                    if (self.setup.conflicts.strategy === constants.ConflictResolutionStrategy.ClientWins) {
                        return self._applyClientWins(collections);
                    } else {
                        return self._applyStandardSync(collections);
                    }
                });
        },

        /**
         * Get all the offline items that have not been synced online.
         * @method getItemsForSync
         * @name getItemsForSync
         * @memberOf OfflineModule.prototype
         * @param {function} [success] A success callback.
         * @param {function} [error] An error callback.
         */
        /**
         * Get all the offline items that have not been synced online.
         * @method getItemsForSync
         * @name getItemsForSync
         * @memberOf OfflineModule.prototype
         * @returns {Promise}
         */
        getItemsForSync: function(success, error) {
            var self = this;
            var plainItemsForSync = {};
            return buildPromise(function(successCb, errorCb) {
                self._queryProcessor._getAllCollections()
                    .then(function(collections) {
                        _.each(collections, function(collection, collectionName) {
                            var plainItems = self._getPlainItemsForSync(collection);
                            plainItemsForSync[collectionName] = _.map(plainItems, function(item) {
                                var itemForSync = {
                                    item: _.extend({}, item),
                                    action: item[constants.offlineItemsStateMarker]
                                };

                                delete itemForSync.item[constants.offlineItemsStateMarker];
                                return itemForSync;
                            });
                        });

                        successCb(plainItemsForSync);
                    }).catch(errorCb);
            }, success, error);
        }
    };

    return OfflineModule;
})();