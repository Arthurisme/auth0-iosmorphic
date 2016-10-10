import _ from 'underscore';
import {DataQueryOperations, Headers} from 'constants';
import Query from 'common/query/Query';
import CommonDataQuery from 'common/dataQuery/DataQuery';
import utils from 'utils';
import platform from 'common/platform';

class DataQuery extends CommonDataQuery {

    static operations = DataQueryOperations;

    constructor(config) {
        super(config);

        this.headers = config.headers || {};
        this.useOffline = config.useOffline;
        this.applyOffline = config.applyOffline;
        this.noRetry = config.noRetry; //retry will be done by default, when a request fails because of expired token, once the authentication.completeAuthentication in sdk is called.
        this.skipAuth = config.skipAuth; //if set to true, the sdk will not require authorization if the data query fails because of expired token. Used internally for various login methods.
        this._normalizedHeaders = null;
        this.isSync = config.isSync;

        // TODO remove when the offline module is ready
        const meta = config.meta || config.config.meta || {};
        if (meta.collectionName) {
            this.collectionName = meta.collectionName;
        }
    }

    get canUseOffline() {
        let canUseOffline = null;
        if (utils.isContentType.files(this.collectionName) && platform.isDesktop) {
            const op = this.operation;
            canUseOffline = this.useOffline && (op === DataQueryOperations.Read ||
                op === DataQueryOperations.ReadById ||
                op === DataQueryOperations.FilesGetDownloadUrlById ||
                op === DataQueryOperations.Delete ||
                op === DataQueryOperations.DeleteById);
        } else {
            canUseOffline = this.useOffline;
        }

        return canUseOffline;
    }

    _normalizeHeaders() {
        this._normalizedHeaders = utils.normalizeKeys(this.headers);
    }

    getHeader(header) {
        this._normalizeHeaders();
        var normalizedHeader = header.toLowerCase();
        return this._normalizedHeaders[normalizedHeader];
    }

    getHeaders() {
        this._normalizeHeaders();
        var headers = _.deepExtend(this._normalizedHeaders);
        return headers;
    }

    getHeaderAsJSON(header) {
        this._normalizeHeaders();

        var headerValue;
        if (header) {
            headerValue = this._normalizedHeaders[header.toLowerCase()];
        }

        if (_.isObject(headerValue)) {
            return headerValue;
        }
        if (_.isString(headerValue)) {
            try {
                return JSON.parse(headerValue);
            } catch (e) {
                return headerValue;
            }
        } else {
            return headerValue;
        }
    }

    getQueryParameters() {
        var queryParams = {};

        if (this.operation === DataQuery.operations.ReadById) {
            queryParams.expand = this.getHeaderAsJSON(Headers.expand);
            queryParams.select = this.getHeaderAsJSON(Headers.select);
        } else if (!this.additionalOptions || this.additionalOptions.id === undefined) {
            var sort = this.getHeaderAsJSON(Headers.sort);
            var limit = this.getHeaderAsJSON(Headers.take);
            var skip = this.getHeaderAsJSON(Headers.skip);
            var select = this.getHeaderAsJSON(Headers.select);
            var filter = this.getHeaderAsJSON(Headers.filter);
            var expand = this.getHeaderAsJSON(Headers.expand);
            var aggregate = this.getHeaderAsJSON(Headers.aggregate);

            if (this.query instanceof Query) {
                var filterObj = this.query.build();
                queryParams.filter = filterObj.$where || filter || {};
                queryParams.sort = filterObj.$sort || sort;
                queryParams.limit = filterObj.$take || limit;
                queryParams.skip = filterObj.$skip || skip;
                queryParams.select = filterObj.$select || select;
                queryParams.expand = filterObj.$expand || expand;
                queryParams.aggregate = filterObj.$aggregate || aggregate;
            } else {
                // TODO left for backward compatibility, should be removed later
                queryParams.filter = (this.filter || filter) || this.config.filter || {};
                queryParams.sort = sort;
                queryParams.limit = limit;
                queryParams.skip = skip;
                queryParams.select = select;
                queryParams.expand = expand;
                queryParams.aggregate = aggregate;
            }
        }

        return queryParams;
    }

    applyEventQuery(eventQuery) {
        this._applyCustomHeaders(eventQuery);
        this._applyEventQueryHeaders(eventQuery);
        this._applyEventQueryParams(eventQuery);
        this.additionalOptions = this.additionalOptions || {};
        this.additionalOptions.id = eventQuery.itemId;
        this.data = eventQuery.data;
        this._applyEventQuerySettings(eventQuery);
    }

    _applyCustomHeaders(eventQuery) {
        this.headers = eventQuery.headers;
        this._normalizeHeaders();
    }

    _applyEventQueryHeaders(eventQuery) {
        this._applyEventHeader(Headers.filter, eventQuery.filter);
        this._applyEventHeader(Headers.select, eventQuery.fields);
        this._applyEventHeader(Headers.sort, eventQuery.sort);
        this._applyEventHeader(Headers.skip, eventQuery.skip);
        this._applyEventHeader(Headers.take, eventQuery.take);
        this._applyEventHeader(Headers.expand, eventQuery.expand);
        this._applyEventHeader(Headers.aggregate, eventQuery.aggregate);
        this._applyEventHeader(Headers.powerFields, eventQuery.powerfields);
    }

    _applyEventQueryParams(eventQuery) {
        if (eventQuery.filter) {
            this.query = this.query || {};
            this.query.filter = eventQuery.filter;
        }

        if (eventQuery.aggregate) {
            this.query = this.query || {};
            this.query.aggregateExpression = eventQuery.aggregate;
        }

        this.fields = eventQuery.select;
        this.sort = eventQuery.sort;
        this.skip = eventQuery.skip;
        this.take = eventQuery.take;
        this.expand = eventQuery.expand;
    }

    _applyEventQuerySettings(eventQuery) {
        this.useOffline = eventQuery.settings.useOffline;
        this.forceCache = eventQuery.settings.forceCache;
        this.ignoreCache = eventQuery.settings.ignoreCache;
        this.applyOffline = eventQuery.settings.applyOffline;
    }

    _applyEventHeader(header, value) {
        if (value && typeof value !== 'string') {
            var headerToLower = header.toLowerCase();
            this.headers[headerToLower] = JSON.stringify(value);
        }
    }
}

module.exports = DataQuery;