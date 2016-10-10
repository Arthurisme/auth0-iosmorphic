import {
    EverliveError,
    EverliveErrors
} from 'EverliveError';

export default class OfflineQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        if (!query.canUseOffline) {
            return iterator.next(value);
        }

        if (!query.applyOffline) {
            const error = new EverliveError('The applyOffline must be true when working offline.');
            return iterator.error(error);
        } else {
            return data.offlineStorage.processQuery(query)
                .then((...args) => {
                    return iterator.next(...args);
                }, err => {
                    if (!err.code) {
                        err = new EverliveError(err.message, EverliveErrors.generalDatabaseError.code);
                    }

                    return iterator.error(err);
                });
        }
    }
}