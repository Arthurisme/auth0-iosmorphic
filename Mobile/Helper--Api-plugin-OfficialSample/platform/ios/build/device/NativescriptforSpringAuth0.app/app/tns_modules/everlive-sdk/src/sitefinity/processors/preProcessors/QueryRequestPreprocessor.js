import RequestFactory from 'RequestFactory';
import {DataQueryOperations} from 'constants';

export default class QueryRequestPreprocessor {
    constructor() {
        this.factory = new RequestFactory();
    }

    processDataQuery(query, iterator, data, value) {
        let request = null;
        switch (query.operation) {
            case DataQueryOperations.Read:
                request = this.factory.get(query, data);
                break;
            case DataQueryOperations.ReadSingle:
                request = this.factory.getSingle(query, data);
                break;
            default:
                return iterator.error(new Error(`Unknown data query operation - ${query.operation}`));
        }

        query.request = request;
        return iterator.next(value);
    }
}