import {
    default as CommonDataQueryBuilder
} from 'common/dataQuery/DataQueryBuilder';
import DataQuery from 'dataQuery/DataQuery';
import Query from 'query/Query';
import {DataQueryOperations, Headers} from 'constants';
import {contains, chain, has, extend, find} from 'underscore';

export default class DataQueryBuilder extends CommonDataQueryBuilder {
    static _tryBuildQueryAllowedOperations = [
        DataQueryOperations.Read,
        DataQueryOperations.ReadById,
        DataQueryOperations.Count,
        DataQueryOperations.Aggregate,
        DataQueryOperations.SetAcl,
        DataQueryOperations.Update,
        DataQueryOperations.SetOwner,
        DataQueryOperations.Delete,
        DataQueryOperations.DeleteById,
        DataQueryOperations.RawUpdate
    ];

    static _tryGetDataAllowedOperations = [
        DataQueryOperations.Create,
        DataQueryOperations.RawUpdate,
        DataQueryOperations.Update,
        DataQueryOperations.SetOwner,
        DataQueryOperations.UserLogin,
        DataQueryOperations.UserLoginWithProvider,
        DataQueryOperations.FilesUpdateContent,
        DataQueryOperations.UserResetPassword,
        DataQueryOperations.UserSetPassword,
        DataQueryOperations.UserChangePassword,
        DataQueryOperations.UserLinkWithProvider,
        DataQueryOperations.UserUnlinkFromProvider
    ];

    static _tryGetDataFields = [
        'updateObject',
        'data'
    ];

    _getInitialDataQuery(operation, meta) {
        return new DataQuery({meta, operation});
    }

    _isOperationAllowed(operations, operation) {
        return contains(operations, operation);
    }

    _buildQuery(filterOrQuery) {
        if (!filterOrQuery) {
            return null;
        }

        if (filterOrQuery instanceof Query) {
            return filterOrQuery;
        } else {
            return new Query(filterOrQuery);
        }
    }

    _tryBuildQuery(op, data) {
        const operations = DataQueryBuilder._tryBuildQueryAllowedOperations;
        if (!this._isOperationAllowed(operations, op)) {
            return null;
        }

        const query = has(data, 'query') ? data.query : data;
        return this._buildQuery(query);
    }

    _tryGetData(op, data) {
        const operations = DataQueryBuilder._tryGetDataAllowedOperations;
        if (!this._isOperationAllowed(operations, op)) {
            return null;
        }

        //TODO: this will not quite work if the user wants to create an item with a "data" field for example.
        const fields = DataQueryBuilder._tryGetDataFields;
        const field = find(fields, field => has(data, field));
        if (field) {
            return data[field];
        }

        return data;
    }

    _isAuthenticationOperation(op) {
        return op === DataQueryOperations.UserLogin ||
            op === DataQueryOperations.UserLogout ||
            op === DataQueryOperations.UserLoginWithProvider ||
            op === DataQueryOperations.UserLinkWithProvider ||
            op === DataQueryOperations.UserUnlinkFromProvider;
    }

    _isCloudCodeOperation(op) {
        return op === DataQueryOperations.InvokeCloudFunction ||
                op === DataQueryOperations.InvokeStoredProcedure;
    }

    _applyOperationSpecificProperties(op, query) {
        if (op === DataQueryOperations.UserLoginWithProvider) {
            query.authHeaders = false;
        } else if (this._isCloudCodeOperation(op)) {
            const {customParameters, authHeaders} = query.additionalOptions;
            query.authHeaders = authHeaders;
            if (customParameters) {
                query.headers = extend(query.headers, {
                    [Headers.customParameters]: JSON.stringify(customParameters)
                });
            }
        }

        if (this._isAuthenticationOperation(op)) {
            query.skipAuth = true;
        }

        return query;
    }

    buildDataQuery(data, op, meta, success, error) {
        if (!chain(DataQueryOperations).values().contains(op).value()) {
            throw new Error(`Unknown data query operation - ${op}`);
        }

        const dataQuery = super.buildDataQuery(data, op, meta, success, error);

        if (dataQuery.query) {
            return dataQuery;
        }

        //null causes invalid request body
        dataQuery.query = this._tryBuildQuery(op, data) || undefined;
        dataQuery.data = this._tryGetData(op, data) || undefined;
        this._applyOperationSpecificProperties(op, dataQuery);

        return dataQuery;
    }
}