import _ from 'underscore';

import utils from 'utils';
import { EverliveError, EverliveErrors, EverliveErrorHelper } from 'EverliveError';

export default class DataPreprocessor {
    processDataQuery(query, iterator, data, value) {
        var offlineStorageEnabled = data.sdk._isOfflineStorageEnabled();
        query.useOffline = offlineStorageEnabled ? !data.sdk.isOnline() : false;

        var isCachingEnabled = (data.sdk.setup.caching === true || (data.sdk.setup.caching && data.sdk.setup.caching.enabled));
        var isSupportedInOffline = utils.isQuerySupportedOffline(query);

        if (data.options) {
            query = _.extend(query, data.options);
            data.options = null;
        }

        query.useCache = isCachingEnabled && !query.isSync && isSupportedInOffline;
        query.applyOffline = query.applyOffline !== undefined ? query.applyOffline : offlineStorageEnabled || query.useCache;

        if (!query.useCache && (query.forceCache || query.maxAge || query.ignoreCache)) {
            let wantedCacheOperation;
            if (query.forceCache) {
               wantedCacheOperation = 'forceCache';
            } else if (query.maxAge) {
                wantedCacheOperation = 'maxAge';
            } else {
                wantedCacheOperation = 'ignoreCache';
            }

            const cacheDisabledErrorMessage = EverliveErrorHelper.buildCacheDisabledErrorMessage(wantedCacheOperation);
            return iterator.error(new EverliveError(cacheDisabledErrorMessage, EverliveErrors.cacheDisabled.code));
        }

        return iterator.next(value);
    }
}