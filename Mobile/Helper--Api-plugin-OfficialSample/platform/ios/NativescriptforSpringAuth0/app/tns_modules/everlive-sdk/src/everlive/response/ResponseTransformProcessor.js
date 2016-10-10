import {DataQueryOperations} from 'constants';
import {isArray,extend,each} from 'underscore';

//TODO: is this really needed or is obsolete, or at least parts of it
export default class ResponseDataMergeProcessor {
    mergeResultData(data, res) {
        var attrs = res.result;
        // support for kendo observable array
        if (isArray(data) || typeof data.length === 'number') {
            each(data, function (item, index) {
                extend(item, attrs[index]);
            });
        } else {
            extend(data, attrs);
        }

        return res;
    }

    mergeUpdateResultData(data, res) {
        var modifiedAt = res.ModifiedAt;
        data.ModifiedAt = modifiedAt;
        return res;
    }

    processDataQuery(query, iterator, data, value) {
        let result = null;
        switch (query.operation) {
            case DataQueryOperations.Update:
                result = this.mergeUpdateResultData(query.data, value);
                break;
            case DataQueryOperations.Create:
                result = this.mergeResultData(query.data, value);
                break;
            case DataQueryOperations.FilesGetDownloadUrlById:
                result = value.result.Uri;
                break;
            default:
                result = value;
                break;
        }

        return iterator.next(result);
    }
}