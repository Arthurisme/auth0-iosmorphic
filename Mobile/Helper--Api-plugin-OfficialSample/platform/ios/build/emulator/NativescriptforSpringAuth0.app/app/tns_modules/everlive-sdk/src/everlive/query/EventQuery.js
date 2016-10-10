'use strict';

import constants from 'constants';

/**
 * @class EventQuery
 * @classdesc A query which is passed in the 'beforeExecute' event of [Everlive]{@link Everlive}. Allows changing the parameters of
 * a query before executing it.
 */
var EventQuery = function () {
};

/** The name of the content type, e.g. EmailSubcrbers.
 * @memberOf EventQuery.prototype
 * @member {string} contentTypeName
 */

/** The query data which will be send to the server.
 * @memberOf EventQuery.prototype
 * @member {Object} data
 */

/** The query headers which will be send with the HTTP request.
 * @memberOf EventQuery.prototype
 * @member {Object} headers
 */

/** The Id of the item.
 * @memberOf EventQuery.prototype
 * @member {string} itemId
 */

/** The type of the operation--read, write, update, delete.
 * @memberOf EventQuery.prototype
 * @member {string} operation
 */

/** A power fields expression.
 * @memberOf EventQuery.prototype
 * @member {string} powerfields
 * @deprecated
 */

/** A custom settings object.
 * @memberOf EventQuery.prototype
 * @member {string} settings
 */

/** A [filter expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-filtering) definition.
 * @memberOf EventQuery.prototype
 * @member {Object} filter
 */

/** A [fields expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-subset-fields) definition.
 * @memberOf EventQuery.prototype
 * @member {Object} fields
 */

/** A [sort expression](http://docs.telerik.com/platform/backend-services/rest/queries/queries-sorting) definition.
 * @memberOf EventQuery.prototype
 * @member {Object} sort
 */

/** The number of result items to skip. Used for paging.
 * @memberOf EventQuery.prototype
 * @member {Number} skip
 */

/** The number of result items to take. Used for paging.
 * @memberOf EventQuery.prototype
 * @member {Number} take
 */

/** An [expand expression](http://docs.telerik.com/platform/backend-services/javascript/data/relations/relations-defining) definition.
 * @memberOf EventQuery.prototype
 * @member {Object} expand
 */

/** Indicates whether the query is a synchronization query. Used with Offline Support.
 * @memberOf EventQuery.prototype
 * @member {boolean} isSync
 * @readonly
 */

function applyDataQueryParameters(eventQuery, dataQuery) {
    var queryParameters = dataQuery.getQueryParameters();
    eventQuery.filter = queryParameters.filter;
    eventQuery.fields = queryParameters.select;
    eventQuery.sort = queryParameters.sort;
    eventQuery.skip = queryParameters.skip;
    eventQuery.take = queryParameters.limit || queryParameters.take;
    eventQuery.expand = queryParameters.expand;
    eventQuery.aggregate = queryParameters.aggregate;
    return queryParameters;
}

/** An object allowing to modify the settings of the EventQuery.
 * @memberOf EventQuery.prototype
 * @member {Object} settings
 * @property {boolean} useOffline - Modifies whether the query should be invoked on the offline storage.
 * @property {boolean} applyOffline - Modifies whether the query should be applied offline if the SDK is currently working online. Default is true. Only valid when offlineStorage is enabled.
 * @property {boolean} ignoreCache - Does not use the cache when retrieving the data. Only valid when caching is enabled.
 * @property {boolean} forceCache - Forces the request to get the data from the cache even if the data is already expired. Only valid when caching is enabled.
 */

function applyDataQuerySettings(eventQuery, dataQuery) {
    eventQuery.settings = {
        useOffline: dataQuery.useOffline,
        applyOffline: dataQuery.applyOffline,
        ignoreCache: dataQuery.ignoreCache,
        forceCache: dataQuery.forceCache
    };
}

EventQuery.fromDataQuery = function (dataQuery) {
    var eventQuery = new EventQuery();
    eventQuery.contentTypeName = dataQuery.collectionName;
    if (dataQuery.additionalOptions && dataQuery.additionalOptions.id) {
        switch (dataQuery.operation) {
            case constants.DataQueryOperations.Update:
                eventQuery.operation = constants.DataQueryOperations.UpdateById;
                break;
            case constants.DataQueryOperations.Delete:
                eventQuery.operation = constants.DataQueryOperations.DeleteById;
                break;
            default:
                eventQuery.operation = dataQuery.operation;
        }
    } else {
        eventQuery.operation = dataQuery.operation;
    }

    eventQuery.itemId = dataQuery.additionalOptions ? dataQuery.additionalOptions.id : undefined;
    eventQuery.data = dataQuery.data;

    applyDataQuerySettings(eventQuery, dataQuery);
    applyDataQueryParameters(eventQuery, dataQuery);
    eventQuery.headers = dataQuery.getHeaders();
    var powerFieldsHeader = eventQuery.headers[constants.Headers.powerFields];
    if (typeof powerFieldsHeader === 'string') {
        eventQuery.powerfields = JSON.parse(powerFieldsHeader);
    }
    eventQuery.isSync = dataQuery.isSync; // readonly

    return eventQuery;
};

/**
 * Cancels the query.
 * @memberOf EventQuery.prototype
 * @method cancel
 */

/**
 * Indicates whether the query has been canceled.
 * @memberOf EventQuery.prototype
 * @method isCanceled
 * @returns {boolean}
 */

EventQuery.prototype = {
    cancel: function () {
        this._cancelled = true;
    },
    isCancelled: function () {
        return this._cancelled;
    }
};

module.exports = EventQuery;