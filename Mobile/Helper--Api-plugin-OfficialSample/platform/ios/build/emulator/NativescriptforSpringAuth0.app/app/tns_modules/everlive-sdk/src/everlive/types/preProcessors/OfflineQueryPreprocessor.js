import {
    EverliveError,
    EverliveErrors
} from 'EverliveError';
import {
    operations as DataQueryOperations
} from 'dataQuery/DataQuery';
import utils from 'utils';
import {extend} from 'underscore';
import platform from 'common/platform';

export default class OfflineQueryPreprocessor {
    processDataQuery(query, iterator, data, value) {
        if ((!query.isSync && data.offlineStorage && data.offlineStorage.isSynchronizing())) {
            const error = new EverliveError(EverliveErrors.syncInProgress);
            return iterator.error(error);
        }

        if (utils.isContentType.files(data.collectionName) && platform.isDesktop) {
            const op = query.operation;

            if (query.useOffline && query.applyOffline && (op === DataQueryOperations.Create || op === DataQueryOperations.Update)) {
                const error = new EverliveError(EverliveErrors.filesNotSupportedInBrowser);
                return iterator.error(error);
            }
        }

        return iterator.next(value);
    }
}