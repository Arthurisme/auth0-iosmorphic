import _ from 'underscore';
import {isFunction} from 'underscore';
import DataQuery from 'common/dataQuery/DataQuery';
import Query from 'common/query/Query';

export default class DataQueryBuilder {
    _getInitialDataQuery(operation, meta) {
        return new DataQuery({meta, operation});
    }

    buildDataQuery(data, op, meta) {
        const dataQuery = this._getInitialDataQuery(op, meta);

        if (data instanceof Query) {
            dataQuery.query = data;
        }

        if (data) {
            dataQuery.additionalOptions = data.additionalOptions;
        }

        const extendedDataQuery = _.extend(dataQuery, meta);

        return extendedDataQuery;
    }
}