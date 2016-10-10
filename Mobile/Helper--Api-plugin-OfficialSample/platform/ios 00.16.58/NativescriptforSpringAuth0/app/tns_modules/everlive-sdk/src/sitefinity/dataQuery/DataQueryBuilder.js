import {
    default as CommonDataQueryBuilder
} from 'common/dataQuery/DataQueryBuilder';
import DataQuery from 'dataQuery/DataQuery';
import Query from 'query/Query';
import {DataQueryOperations} from 'constants';

export default class DataQueryBuilder extends CommonDataQueryBuilder {
    _getInitialDataQuery(operation, meta) {
        return new DataQuery({meta, operation});
    }

    buildDataQuery(data, op, meta) {
        const dataQuery = super.buildDataQuery(data, op, meta);

        if (dataQuery.query instanceof Query) {
            return dataQuery;
        }

        if (op === DataQueryOperations.ReadSingle) { //TODO: other operations
            dataQuery.data = data;
        }

        return dataQuery;
    }
}