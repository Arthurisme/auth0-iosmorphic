import {DataQueryOperations} from 'constants';
import {RequestService} from 'services/RequestService'

export default class BusinessLogicQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        const op = query.operation;
        if (op !== DataQueryOperations.InvokeCloudFunction &&
            op !== DataQueryOperations.InvokeStoredProcedure) {
            return iterator.next(value);
        }

        const request = RequestService.buildRequest(query, data);
        return request.send()
            .then(res => {
                return iterator.end(res);
            })
            .catch(err => {
                return iterator.error(err);
            });
    }
}