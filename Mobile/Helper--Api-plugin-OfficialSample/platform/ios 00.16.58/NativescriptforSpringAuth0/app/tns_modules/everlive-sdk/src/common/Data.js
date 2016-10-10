import DataQuery from 'common/dataQuery/DataQuery';

export default class CommonData {
    constructor(sdk, settings) {
        this.settings = settings;
        this.sdk = sdk;
    }

    processDataQuery(query, success, error) {
        return this.sdk.processDataQuery(query, this, success, error);
    }

    buildDataQuery(data, op, meta) {
        return this.sdk.buildDataQuery(data, op, meta);
    }

    create(model, success, error) {
        return this.sdk.buildDataQuery(this, model, DataQuery.operations.Create, success, error);
    }

    getById(id, success, error) {
        // return utils.buildPromise((success, error) => {
        //     let getByIdQuery = this._buildDataQuery(id, DataQuery.operations.ReadById, success, error);
        //     return super.getById(getByIdQuery);
        // }, success, error);
    }

    get(filterOrQuery, success, error) {
        // if (!filterOrQuery) {
        //     throw 'Filter for get is required';
        // }
        //
        // return utils.buildPromise((success, error) => {
        //     let getQuery = this._buildDataQuery(filterOrQuery, DataQuery.operations.Read, success, error);
        //     return super.get(getQuery);
        // }, success, error);
    }

    count(filterOrQuery, success, error) {
        // return utils.buildPromise((success, error) => {
        //     let countQuery = this._buildDataQuery(filterOrQuery, DataQuery.operations.Count, success, error);
        //     return super.count(countQuery);
        // }, success, error);
    }
}