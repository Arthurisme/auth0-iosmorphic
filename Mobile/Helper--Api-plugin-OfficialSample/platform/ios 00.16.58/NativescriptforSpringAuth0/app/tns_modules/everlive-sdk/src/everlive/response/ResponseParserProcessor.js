import {DataQueryOperations} from 'constants';
import Request from 'Request';

class ResponseProcessor {
    processDataQuery(query, iterator, data, value) {
        if (query.operation === DataQueryOperations.InvokeCloudFunction ||
            query.operation === DataQueryOperations.InvokeStoredProcedure) {
            return iterator.next(value);
        }

        let parser = null;
        switch (query.operation) {
            case DataQueryOperations.ReadById:
            case DataQueryOperations.Aggregate:
            case DataQueryOperations.Count:
            case DataQueryOperations.Create:
            case DataQueryOperations.SetAcl:
            case DataQueryOperations.FilesGetDownloadUrlById:
            case DataQueryOperations.UserLinkWithProvider:
            case DataQueryOperations.UserUnlinkFromProvider:
                parser = Request.parsers.single;
                break;
            case DataQueryOperations.RawUpdate:
            case DataQueryOperations.Update:
                parser = Request.parsers.update;
                break;
            default:
                if (query.isCustomRequest) {
                    parser = Request.parsers.customRequest;
                } else {
                    parser = Request.parsers.simple;
                }
        }

        const parsedResponse = parser.result(value);

        return iterator.next(parsedResponse);
    }
}

module.exports = ResponseProcessor;