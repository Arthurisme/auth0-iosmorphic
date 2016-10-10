'use strict';

import _ from 'underscore';
import util from 'util';
import LocalStore from 'storages/LocalStore';
import BasePersister from 'offline/persisters/BasePersister';

var LocalStoragePersister = (function () {

    /**
     * @class LocalStoragePersister
     * @extends BasePersister
     */
    function LocalStoragePersister(key, options) {
        BasePersister.apply(this, arguments);
        this._localStore = new LocalStore(options);
    }

    util.inherits(LocalStoragePersister, BasePersister);

    LocalStoragePersister.prototype.getData = function (contentType, success, error) {
        try {
            var key = this._getKey(contentType);
            var storedItem = this._getItem(key);
            success(storedItem);
        } catch (e) {
            error(e);
        }
    };

    LocalStoragePersister.prototype.saveData = function (contentType, data, success, error) {
        try {
            var contentTypeKey = this._getKey(contentType);
            this._setItem(contentTypeKey, data);
            success();
        } catch (e) {
            error(e);
        }
    };

    LocalStoragePersister.prototype.purge = function (contentType, success, error) {
        var self = this;

        try {
            var key = this._getKey(contentType);
            this._removeItem(key);
            this._getContentTypes(function (contentTypes) {
                contentTypes = _.without(contentTypes, contentType);
                self._setContentTypesCollection(contentTypes);
                success();
            }, error);
        } catch (e) {
            error(e);
        }
    };

    LocalStoragePersister.prototype.purgeAll = function (success, error) {
        try {
            var self = this;

            this._getContentTypes(function (contentTypes) {
                _.each(contentTypes, function (contentType) {
                    var contentTypeKey = self._getKey(contentType);
                    self._removeItem(contentTypeKey);
                });

                self._removeItem(self.contentTypesStoreKey);
                success();
            }, error);
        } catch (e) {
            error(e);
        }
    };

    LocalStoragePersister.prototype._getItem = function (key) {
        return this._localStore.getItem(key);
    };

    LocalStoragePersister.prototype._setItem = function (key, value) {
        return this._localStore.setItem(key, value);
    };

    LocalStoragePersister.prototype._removeItem = function (key) {
        return this._localStore.removeItem(key);
    };

    LocalStoragePersister.prototype._getKey = function (contentType) {
        this._addTypeToCollectionsCache(contentType);
        return LocalStoragePersister.super_.prototype._getKey.apply(this, arguments);
    };

    LocalStoragePersister.prototype._getContentTypes = function (success, error) {
        try {
            var localStorageString = this._getItem(this.contentTypesStoreKey);

            var data = [];
            if (localStorageString) {
                data = JSON.parse(localStorageString);
            }

            success(data);
        } catch (e) {
            error(e);
        }
    };

    LocalStoragePersister.prototype._setContentTypesCollection = function (collection) {
        this._setItem(this.contentTypesStoreKey, JSON.stringify(collection));
    };

    LocalStoragePersister.prototype._addTypeToCollectionsCache = function (typeName) {
        var self = this;
        this._getContentTypes(function (contentTypes) {
            if (!_.contains(contentTypes, typeName)) {
                contentTypes.push(typeName);
                self._setContentTypesCollection(contentTypes);
            }
        });
    };

    return LocalStoragePersister;
}());

module.exports = LocalStoragePersister;