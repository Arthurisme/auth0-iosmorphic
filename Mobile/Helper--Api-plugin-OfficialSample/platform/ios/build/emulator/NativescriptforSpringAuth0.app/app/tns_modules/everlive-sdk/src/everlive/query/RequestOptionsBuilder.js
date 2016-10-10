import _ from 'underscore';
import path from 'path';
import {DataQueryOperations} from 'constants';
import Request from 'Request';

module.exports = (function () {
    const RequestOptionsBuilder = {};

    RequestOptionsBuilder._buildEndpointUrl = function (dataQuery) {
        let endpoint = dataQuery.collectionName;
        const isQueryById = dataQuery.additionalOptions && dataQuery.additionalOptions.id !== undefined;
        const queryType = typeof dataQuery.query;

        if (isQueryById) {
            endpoint = path.join(endpoint, dataQuery.additionalOptions.id.toString());
        } else if (queryType === 'string' || queryType === 'number') {
            endpoint = path.join(endpoint, dataQuery.query);
        }

        return endpoint;
    };

    RequestOptionsBuilder._buildBaseObject = function (dataQuery) {
        const defaultObject = {
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery),
            query: dataQuery.query,
            data: dataQuery.data,
            headers: dataQuery.headers
        };

        if (dataQuery.parse) {
            defaultObject.parse = dataQuery.parse;
        }

        return defaultObject;
    };

    RequestOptionsBuilder._build = function (dataQuery, additionalOptions) {
        const options = _.extend(RequestOptionsBuilder._buildBaseObject(dataQuery), additionalOptions);

        if (additionalOptions.endpointSupplement) {
            options.endpoint = path.join(options.endpoint, additionalOptions.endpointSupplement);
        }

        return options;
    };

    RequestOptionsBuilder[DataQueryOperations.Read] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.ReadById] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.Count] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: dataQuery.collectionName + '/_count'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.Create] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.RawUpdate] = function (dataQuery) {
        var query = dataQuery.query;
        var ofilter = typeof query === 'object' ? query : null; // request options filter

        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            query: ofilter
        });
    };

    RequestOptionsBuilder[DataQueryOperations.Update] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.Delete] = function (dataQuery) {
        return _.extend(RequestOptionsBuilder._buildBaseObject(dataQuery), {
            method: 'DELETE'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.DeleteById] = RequestOptionsBuilder[DataQueryOperations.Delete];

    RequestOptionsBuilder[DataQueryOperations.SetAcl] = function (dataQuery) {
        let method, data;
        if (dataQuery.additionalOptions.acl === null) {
            method = 'DELETE';
        } else {
            method = 'PUT';
            data = dataQuery.additionalOptions.acl;
        }

        return RequestOptionsBuilder._build(dataQuery, {
            method: method,
            endpointSupplement: '/_acl',
            data: data
        });
    };

    RequestOptionsBuilder[DataQueryOperations.SetOwner] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            endpointSupplement: '/_owner'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserLogin] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: 'oauth/token',
            authHeaders: false,
            parse: Request.parsers.single
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserLogout] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: 'oauth/logout'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserChangePassword] = function (dataQuery) {
        const keepTokens = dataQuery.additionalOptions.keepTokens;
        let endpoint = 'Users/changepassword';
        if (keepTokens) {
            endpoint += '?keepTokens=true';
        }

        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: endpoint,
            parse: Request.parsers.single
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserLoginWithProvider] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            authHeaders: false
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserLinkWithProvider] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/link'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserUnlinkFromProvider] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/unlink'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserResetPassword] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/resetpassword'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.UserSetPassword] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/setpassword'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.FilesUpdateContent] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/Content'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.FilesGetDownloadUrlById] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    };

    RequestOptionsBuilder[DataQueryOperations.Aggregate] = function (dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: dataQuery.collectionName + '/_aggregate'
        });
    };

    function businessLogic(dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, dataQuery.additionalOptions);
    }

    RequestOptionsBuilder[DataQueryOperations.InvokeCloudFunction] = businessLogic;
    RequestOptionsBuilder[DataQueryOperations.InvokeStoredProcedure] = businessLogic;

    return RequestOptionsBuilder;
}());