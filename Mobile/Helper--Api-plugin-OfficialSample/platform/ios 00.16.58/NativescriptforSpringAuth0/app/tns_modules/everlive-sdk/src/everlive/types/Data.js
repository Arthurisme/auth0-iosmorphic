import utils, {buildPromise} from 'utils';
import constants, {idField, DataQueryOperations} from 'constants';
import DataQuery from 'dataQuery/DataQuery';
import rsvp from 'rsvp';
import {EverliveError, EverliveErrors, EverliveErrorHelper} from 'EverliveError';
import {platform as everlivePlatform} from 'everlive.platform';
import _ from 'underscore';
import Query from 'query/Query';
import CommonData from 'common/Data';

module.exports = (function () {
    /**
     * @class Data
     * @classdesc A class that provides methods for all CRUD operations to a given {{site.bs}} data type. Covers advanced scenarios with custom headers and special server-side functionality.
     * @param {object} collectionName
     * @param {object} sdk
     * @protected
     */
    class Data extends CommonData {
        constructor(sdk, collectionName) {
            super(sdk, collectionName);

            this.collectionName = collectionName;
            this.setup = this.sdk.setup;
            this.options = null;
        }

        get offlineStorage() {
            return this.sdk.offlineStorage;
        }

        _isOnline() {
            return this.offlineStorage ? this.offlineStorage.isOnline() : true;
        }

        _getOfflineCreateData(query, requestResponse) {
            var createData;
            if (_.isArray(query.data)) {
                createData = [];
                for (var i = 0; i < query.data.length; i++) {
                    var objectToCreate = _.extend(query.data[i], requestResponse.Result[i]);
                    createData.push(objectToCreate)
                }
            } else {
                createData = _.extend(query.data, requestResponse.Result);
            }

            return createData;
        }

        _applyOffline(query, requestResponse) {
            var autoSyncEnabled = this.offlineStorage && this.offlineStorage.setup.autoSync;
            if (autoSyncEnabled) {
                switch (query.operation) {
                    case DataQueryOperations.Read:
                    case DataQueryOperations.ReadById:
                    case DataQueryOperations.FilesGetDownloadUrlById:
                        var syncReadQuery = new DataQuery(_.defaults({
                            data: requestResponse.Result,
                            isSync: true,
                            operation: DataQueryOperations.Create
                        }, query));
                        return this.offlineStorage.processQuery(syncReadQuery);
                    case DataQueryOperations.Create:
                        var createData = this._getOfflineCreateData(query, requestResponse);
                        var createQuery = new DataQuery(_.defaults({
                            data: createData,
                            isSync: true
                        }, query));
                        return this.offlineStorage.processQuery(createQuery);
                    case DataQueryOperations.Update:
                    case DataQueryOperations.RawUpdate:
                        query.isSync = true;
                        query.ModifiedAt = requestResponse.ModifiedAt;
                        return this.offlineStorage.processQuery(query);
                    default:
                        query.isSync = true;
                        return this.offlineStorage.processQuery(query);
                }
            }

            return new rsvp.Promise(function (resolve) {
                resolve();
            });
        }

        _setOption(key, value) {
            this.options = this.options || {};
            if (_.isObject(value)) {
                this.options[key] = _.extend({}, this.options[key], value);
            } else {
                this.options[key] = value;
            }

            return this;
        }

        _generateQueryFromFilter(filterOrQuery) {
            if (filterOrQuery instanceof Query) {
                return filterOrQuery;
            } else {
                return new Query(filterOrQuery);
            }
        }

        /**
         * Modifies whether the query should be invoked on the offline storage.
         * @memberOf Data.prototype
         * @method useOffline
         * @name useOffline
         * @param {boolean} [useOffline]
         * @returns {Data} Returns the same instance of the Data object.
         */
        useOffline(useOffline) {
            if (arguments.length !== 1) {
                const message = EverliveErrorHelper.buildSingleValueExpectedErrorMessage('useOffline()');
                throw new EverliveError(message, EverliveErrors.singleValueExpected.code);
            }

            const isOfflineEnabled = this.sdk._isOfflineStorageEnabled();
            if (useOffline === true && !isOfflineEnabled) {
                throw new EverliveError(EverliveErrors.noOfflineSupport);
            }

            return this._setOption('useOffline', useOffline);
        }

        /**
         * Does not use the cache when retrieving the data.
         * Only valid when caching is enabled.
         * @memberOf Data.prototype
         * @method ignoreCache
         * @name ignoreCache
         * @returns {Data}
         * */
        ignoreCache() {
            return this._setOption('ignoreCache', true);
        }

        /**
         * Forces the request to get the data from the cache even if the data is already expired.
         * Only valid when caching is enabled.
         * @memberOf Data.prototype
         * @method forceCache
         * @name forceCache
         * @returns {Data}
         * */
        forceCache() {
            return this._setOption('forceCache', true);
        }

        /**
         * Sets cache expiration specifically for the current query.
         * Only valid when caching is enabled.
         * @memberOf Data.prototype
         * @method maxAge
         * @name maxAge
         * @param maxAgeInMinutes
         * @returns {Data}
         * */
        maxAge(maxAgeInMinutes) {
            var maxAge = maxAgeInMinutes * 1000 * 60;
            return this._setOption('maxAge', maxAge);
        }

        isSync(isSync) {
            if (arguments.length !== 1) {
                const message = EverliveErrorHelper.buildSingleValueExpectedErrorMessage('isSync()');
                throw new EverliveError(message, EverliveErrors.singleValueExpected.code);
            }
            return this._setOption('isSync', isSync);
        }

        /**
         * Modifies whether the query should try to authenticate if the security token has expired.
         * Default is false.
         * Only valid when the authentication module has an onAuthenticationRequired function.
         * @memberOf Data.prototype
         * @method skipAuth
         * @param skipAuth
         * @returns {Data}
         * */
        skipAuth(skipAuth) {
            if (arguments.length !== 1) {
                const message = EverliveErrorHelper.buildSingleValueExpectedErrorMessage('skipAuth()');
                throw new EverliveError(message, EverliveErrors.singleValueExpected.code);
            }
            return this._setOption('skipAuth', skipAuth);
        }

        /**
         * Modifies whether the query should be applied offline, if the sdk is currenty working online.
         * Default is true.
         * Only valid when offlineStorage is enabled.
         * @memberOf Data.prototype
         * @method applyOffline
         * @param applyOffline
         * @returns {Data}
         * */
        applyOffline(applyOffline) {
            if (arguments.length !== 1) {
                const message = EverliveErrorHelper.buildSingleValueExpectedErrorMessage('applyOffline()');
                throw new EverliveError(message, EverliveErrors.singleValueExpected.code);
            }

            return this._setOption('applyOffline', applyOffline);
        }

        /**
         * Sets additional non-standard HTTP headers in the current data request. See [List of Request Parameters](http://docs.telerik.com/platform/backend-services/rest/apireference/RESTfulAPI/custom_headers) for more information.
         * @memberOf Data.prototype
         * @method withHeaders
         * @param {object} headers Additional headers to be sent with the data request.
         * @returns {Data}
         */
        withHeaders(headers) {
            return this._setOption('headers', headers);
        }

        /**
         * Sets an expand expression to be used in the data request. This allows you to retrieve complex data sets using a single query based on relations between data types.
         * @memberOf Data.prototype
         * @method expand
         * @param {object} expandExpression An [expand expression](http://docs.telerik.com/platform/backend-services/rest/data/relations/relations-defining) definition.
         * @returns {Data}
         */
        expand(expandExpression) {
            var expandHeader = {
                'X-Everlive-Expand': JSON.stringify(expandExpression)
            };
            return this.withHeaders(expandHeader);
        }

        _applyQueryOffline(query) {

        }

        _sendRequest(query, online) {

        }

        _applyQueryOnline(query) {
            if (query.useCache) {
                this.sdk.cache._cacheDataQuery(query);
            } else {
                this._sendRequest(query, true);
            }
        }

        _setAdditionalHeaders(query, requestOptions) {
            if (query.isSync) {
                requestOptions.headers[constants.Headers.sync] = true;
            }

            var sdkHeaderValue = {
                sdk: 'js',
                platform: everlivePlatform
            };

            requestOptions.headers[constants.Headers.sdk] = JSON.stringify(sdkHeaderValue);
        }

        buildDataQuery(data, op, success, error) {
            const collectionName = this.collectionName;
            return super.buildDataQuery(data, op, {collectionName}, success, error);
        }

        // TODO implement options: { requestSettings: { executeServerCode: false } }. power fields queries could be added to that options argument
        /**
         * Gets all data items that match the filter. This allows you to retrieve a subset of the items based on various filtering criteria.
         * @memberOf Data.prototype
         * @method get
         * @name get
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Gets all data items that match the filter. This allows you to retrieve a subset of the items based on various filtering criteria.
         * @memberOf Data.prototype
         * @method get
         * @name get
         * @param {object|null} query A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        get(query, success, error) {
            const dataQuery = this.buildDataQuery(query, DataQueryOperations.Read);
            return this.processDataQuery(dataQuery, success, error);
        }

        // TODO handle options
        // TODO think to pass the id as a filter

        /**
         * Gets a data item by ID.
         * @memberOf Data.prototype
         * @method getById
         * @name getById
         * @param {string} id ID of the item.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Gets an item by ID.
         * @memberOf Data.prototype
         * @method getById
         * @name getById
         * @param {string} id ID of the item.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         * */
        getById(id, success, error) {
            if (!utils.modelHasValidId(id)) {
                return this._invalidIdErrorResponse(error);
            }

            const dataQuery = this.buildDataQuery({
                additionalOptions: {id}
            }, DataQueryOperations.ReadById);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         *  A fluent API aggregation / grouping data from server. Can accept aggregationExpression or fluent chaining rules.
         * @memberOf Data.prototype
         * @method aggregate
         * @name aggregate
         * @param {object} aggregateQuery fields / Aggregation functions [aggregationExpression].
         * @returns {Promise} The promise for the request.
         */
        /**
         *  A fluent API aggregation / grouping data from server. Can accept aggregationExpression or fluent chaining rules.
         * @memberOf Data.prototype
         * @method aggregate
         * @name aggregate
         * @param {object} aggregateQuery fields / Aggregation functions [aggregationExpression].
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         * */
        aggregate(aggregateQuery, success, error) {
            const dataQuery = this.buildDataQuery(aggregateQuery, DataQueryOperations.Aggregate);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Gets the count of the data items that match the filter.
         * @memberOf Data.prototype
         * @method count
         * @name count
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Gets the count of the items that match the filter.
         * @memberOf Data.prototype
         * @method count
         * @name count
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        count(filter, success, error) {
            const dataQuery = this.buildDataQuery(filter, DataQueryOperations.Count);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Creates a data item.
         * @memberOf Data.prototype
         * @method create
         * @name create
         * @param {object|object[]} data Item or items that will be created.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Creates an item.
         * @memberOf Data.prototype
         * @method create
         * @name create
         * @param {object|object[]} data The item or items that will be created.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        create(data, success, error) {
            const dataQuery = this.buildDataQuery(data, DataQueryOperations.Create);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Updates all objects that match a filter with the specified update expression.
         * @memberOf Data.prototype
         * @method rawUpdate
         * @name rawUpdate
         * @param {object} updateObject Update object that contains the new values.
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Updates all objects that match a filter with the specified update expression.
         * @memberOf Data.prototype
         * @method rawUpdate
         * @name rawUpdate
         * @param {object} updateObject Update object that contains the new values.
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        /**
         * Updates an object by ID with the specified update expression.
         * @memberOf Data.prototype
         * @method rawUpdate
         * @name rawUpdate
         * @param {object} updateObject Updated object that contains the new values.
         * @param {string} filterOrId The ID of the item.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Updates an object by ID with the specified update expression.
         * @memberOf Data.prototype
         * @method rawUpdate
         * @name rawUpdate
         * @param {object} updateObject Updated object that contains the new values.
         * @param {string} filterOrId The ID of the item.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        rawUpdate(updateObject, filterOrId, success, error) {
            var self = this;
            var isSingleUpdate = typeof filterOrId === 'string' || typeof filterOrId === 'number';

            if (isSingleUpdate && !utils.modelHasValidId(filterOrId)) {
                return self._invalidIdErrorResponse(error);
            }

            const query = isSingleUpdate ? filterOrId : this.sdk.dataQueryBuilder._buildQuery(filterOrId);
            const additionalOptions = {
                id: isSingleUpdate ? filterOrId : undefined
            };

            const dataQuery = this.buildDataQuery({
                query,
                additionalOptions,
                updateObject
            }, DataQueryOperations.RawUpdate);
            return this.processDataQuery(dataQuery, success, error);
        }

        // TODO: Check if there is a case in which replace = true is passed to this function
        _update(attrs, filterOrQuery, single, replace, success, error) {
            const dataQuery = this.buildDataQuery({
                updateObject: {
                    [replace ? '$replace' : '$set']: attrs
                },
                additionalOptions: {
                    id: single ? attrs[idField] : undefined
                },
                query: filterOrQuery
            }, DataQueryOperations.Update);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Updates a single data item. This operation takes an object that specifies both the data item to be updated and the updated values.
         * @memberOf Data.prototype
         * @method updateSingle
         * @name updateSingle
         * @param {object} item The item that will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Updates the provided item.
         * @memberOf Data.prototype
         * @method updateSingle
         * @name updateSingle
         * @param {object} model The item that will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        updateSingle(model, success, error) {
            if (!utils.modelHasValidId(model)) {
                return this._invalidIdErrorResponse(error);
            }

            return this._update(model, null, true, false, success, error);
        }

        _invalidIdErrorResponse(errorHandler) {
            var err = new EverliveError(EverliveErrors.invalidId);
            return utils.callbackAndPromiseErrorResponse(err, errorHandler);
        }

        /**
         * Updates all items that match a filter with the specified update object.
         * @memberOf Data.prototype
         * @method update
         * @name update
         * @param {object} updateObject The update object.
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Updates all items that match the filter with the specified update object.
         * @memberOf Data.prototype
         * @method update
         * @name update
         * @param {object} model The update object.
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        update(model, filter, success, error) {
            return this._update(model, filter, false, false, success, error);
        }

        _destroy(attrs, filterOrQuery, single, success, error) {
            const op = single ? DataQueryOperations.DeleteById : DataQueryOperations.Delete;
            const idField = (attrs && typeof attrs === 'object') ? attrs[constants.idField] : attrs;

            const dataQuery = this.buildDataQuery({
                additionalOptions: {
                    id: single ? idField : undefined
                },
                query: filterOrQuery
            }, op);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Deletes a single data item by ID.
         * @memberOf Data.prototype
         * @method destroySingle
         * @name destroySingle
         * @param {string} itemId The ID of the item to delete.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Deletes a single data item by ID.
         * @memberOf Data.prototype
         * @method destroySingle
         * @name destroySingle
         * @param {string} itemId The ID of the item to delete.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        /**
         * Deletes a single data item by ID.
         * @memberOf Data.prototype
         * @method destroySingle
         * @name destroySingle
         * @param {object} item Object containing the item ID to be deleted.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Deletes a single data item by ID.
         * @memberOf Data.prototype
         * @method destroySingle
         * @name destroySingle
         * @param {object} model Object containing the item ID to be deleted.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        destroySingle(model, success, error) {
            if (!utils.modelHasValidId(model)) {
                return this._invalidIdErrorResponse(error);
            }

            return this._destroy(model, null, true, success, error);
        }

        /**
         * Deletes all data items that match a filter.
         * @memberOf Data.prototype
         * @method destroy
         * @name destroy
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Deletes all items that match the filter.
         * @memberOf Data.prototype
         * @method destroy
         * @name destroy
         * @param {object|null} filter A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        destroy(filter, success, error) {
            return this._destroy(null, filter, false, success, error);
        }

        /**
         * Sets the Access Control List (ACL) of a specified data item.
         * @memberOf Data.prototype
         * @method setAcl
         * @name setAcl
         * @param {object} acl The acl object.
         * @param {object} item The item whose ACL will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Sets the Access Control List (ACL) of a specified data item.
         * @memberOf Data.prototype
         * @method setAcl
         * @name setAcl
         * @param {object} acl The acl object.
         * @param {object} item The item whose ACL will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @param {object} operationParameters An object that accepts operation parameters.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        /**
         * Sets the Access Control List (ACL) of a specified data item.
         * @memberOf Data.prototype
         * @method setAcl
         * @name setAcl
         * @param {object} acl The acl object.
         * @param {string} filter The ID of the item.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Sets the Access Control List (ACL) of an item with a specified ID.
         * @memberOf Data.prototype
         * @method setAcl
         * @name setAcl
         * @param {object} acl The acl object.
         * @param {string} filter The ID of the item or item.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        setAcl(acl, filter, success, error) {
            const self = this;

            if (!utils.modelHasValidId(filter)) {
                return self._invalidIdErrorResponse(error);
            }

            const additionalOptions = {acl};
            const data = {additionalOptions};
            additionalOptions.id = filter[idField] || filter;

            const dataQuery = this.buildDataQuery(data, DataQueryOperations.SetAcl);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Sets the owner of the specified data item.
         * @memberOf Data.prototype
         * @method setOwner
         * @name setOwner
         * @param {string} acl The new owner ID.
         * @param {object} item The item whose owner will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Sets the owner of the specified data item.
         * @memberOf Data.prototype
         * @method setOwner
         * @name setOwner
         * @param {string} acl The new owner ID.
         * @param {object} item The item whose owner will be updated. Note: the ID property of the item will be used to determine which item will be updated.
         * @param {object} operationParameters An object that accepts operation parameters.
         * @param {Function} [operationParameters.success] A success callback.
         * @param {Function} [operationParameters.error] An error callback.
         * @param {Boolean} [operationParameters.useOffline] Whether to invoke the operation on the offline storage. Default is based on the current mode of the Everlive instance.
         * @param {Boolean} [operationParameters.applyOffline=true] If working online, whether to also apply the operation on the local storage.
         */
        /**
         * Sets the owner of the specified data item.
         * @memberOf Data.prototype
         * @method setOwner
         * @name setOwner
         * @param {string} ownerId The new owner ID.
         * @param {string} id The ID of the item.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Sets the owner of the specified data item.
         * @memberOf Data.prototype
         * @method setOwner
         * @name setOwner
         * @param {string} ownerId The new owner ID.
         * @param {string} filter The ID of the item or item.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        setOwner(ownerId, filter, success, error) {
            if (!utils.modelHasValidId(filter)) {
                return this._invalidIdErrorResponse(error);
            }

            const data = {
                updateObject: {Owner: ownerId},
                additionalOptions: {}
            };

            data.additionalOptions.id = filter[idField] || filter;

            const dataQuery = this.buildDataQuery(data, DataQueryOperations.SetOwner);
            return this.processDataQuery(dataQuery, success, error);
        }

        /**
         * Saves the provided data item. This operation will create or update the item depending on whether it is new or existing.
         * @memberOf Data.prototype
         * @method save
         * @name save
         * @param {object} item An object containing the item that is being saved.
         * @returns {Promise} The promise for the request.
         */
        /**
         * Saves the provided data item. This operation will create or update the item depending on whether it is new or existing.
         * @memberOf Data.prototype
         * @method save
         * @name save
         * @param {object} model An object containing the item that is being saved.
         * @param {Function} [success] A success callback.
         * @param {Function} [error] An error callback.
         */
        save(model, success, error) {
            return buildPromise((success, error) => {
                var isNew = this.isNew(model);
                let promise;
                if (isNew) {
                    promise = this.create(model);
                } else {
                    promise = this.updateSingle(model);
                }

                const type = isNew ? 'create' : 'update';
                promise
                    .then(res => {
                        res.type = type;
                        success(res);
                    })
                    .catch(err => {
                        err.type = type;
                        error(err);
                    });
            }, success, error);
        }

        /**
         * Checks if the specified data item is new or not.
         * @memberOf Data.prototype
         * @method isNew
         * @param model Item to check.
         * @returns {boolean}
         */
        isNew(model) {
            return typeof model[idField] === 'undefined';
        }
    }

    return Data;
}());
