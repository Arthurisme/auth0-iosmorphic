import {RequestService} from 'services/RequestService';

export default class CacheQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        if (!query.useCache || (query.useCache && query.canUseOffline)) {
            return iterator.next(value);
        }

        return this._cacheDataQuery(query, data)
            .then(function (result) {
                return iterator.next(result || value);
            }, function (error) {
                return iterator.error(error);
            });
    }

    _cacheDataQuery(query, data) {
        const shouldSkipCache = data.sdk.cache._shouldSkipCache(query);
        if (shouldSkipCache) {
            if (query.ignoreCache && !data.sdk.cache.isQueryUnsupportedOffline(query)) {
                const hash = data.sdk.cache._getHashForQuery(query);

                return data.sdk.cache._cacheQuery(query, hash, data);
            } else {
                return RequestService.handleRequestProcessing(query, data);
            }
        } else {
            query.useCache = false;
            return data.sdk.cache._processCacheItem(query, data);
        }
    }
}