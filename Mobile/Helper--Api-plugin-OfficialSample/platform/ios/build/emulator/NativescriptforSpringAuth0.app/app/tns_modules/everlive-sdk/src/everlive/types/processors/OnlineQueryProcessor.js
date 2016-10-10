import {RequestService} from 'services/RequestService';
import {EverliveErrors} from 'EverliveError';

export default class OnlineQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        if (query.canUseOffline || query.useCache) {
            return iterator.next(value);
        }

        return RequestService.handleRequestProcessing(query, data)
            .then(function (result) {
               return iterator.next(result || value);
            }, function (err) {
                return iterator.error(err);
            });
    }
}