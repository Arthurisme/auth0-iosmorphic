import CommonDataQuery from 'common/dataQuery/DataQuery';

export default class DataQuery extends CommonDataQuery {
    constructor(options) {
        super(options);

        this.request = options.request || null;
    }
}