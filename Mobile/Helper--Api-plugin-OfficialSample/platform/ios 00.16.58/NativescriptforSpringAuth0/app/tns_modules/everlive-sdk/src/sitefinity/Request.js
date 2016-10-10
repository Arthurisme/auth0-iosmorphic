var utils = require('utils');
var constants = require('constants');
import {extend} from 'underscore';

class RequestBase {
    constructor(query, data) {
        this.query = query;
        this.data = data;
        this.urlOptions = data.options;
    }

    static contentTypes = {
        json: 'application/json'
    };

    static headers = {
        contentType: 'Content-Type'
    };

    _execute() {
        return new Promise((resolve, reject) => {
            //TODO: reqwest? - common maybe?

            // build XmlHttpRequest
            const http = new XMLHttpRequest();
            const method = this._getMethod();
            const url = this._buildUrl();
            http.open(method, url, true);

            // TODO: might be configurable
            // TODO: Add 'Authorization' header on each request
            var contentType = 'application/json';
            this._setRequestHeaders(http, contentType);
            http.onreadystatechange = () => {
                // TODO: constants
                if (http.readyState == 4) {
                    if (http.status >= 200 && http.status <= 206) {
                        const data = this._parseResponse(http); //TODO: postProcessor
                        return resolve(data);
                    }
                    else if (http.status >= 400) {
                        return reject(http);
                    }
                }
            };

            this._send(http);
        });
    }

    _parseResponse(http) {
        var ret = null;
        try {
            ret = JSON.parse(http.responseText);
            utils._convertToDateObject(ret);
        } catch (e) {
            ret = http.responseText;
        }

        return ret;
    }

    _send(http) {
        http.send();
    }

    _getMethod() {
        return null;
    }

    _setRequestHeaders(http) {
        if (this.urlOptions.token) {
            var tokenData = this.urlOptions.token;
            http.setRequestHeader("Authorization", tokenData);
        }

        if (this.urlOptions.headers && this.urlOptions.headers.length > 0) {
            for (var i = 0; i < this.urlOptions.headers.length; i++) {
                var header = this.urlOptions.headers[i];
                http.setRequestHeader(header.key, header.val);
            }
        }

        http.setRequestHeader('X-SF-Service-Request', 'true');
    }

    _getQueryParameters(paramDictionary, urlOptions) {
        var clause = constants.SfParams;
        if (urlOptions.SFParams) {
            var sfParams = urlOptions.SFParams;
            if (sfParams.provider) {
                paramDictionary[clause.provider] = sfParams.provider;
            }
            if (sfParams.culture) {
                paramDictionary[clause.culture] = sfParams.culture;
            }
        }
    }

    _getQueryString(urlOptions) {
        var paramDictionary = {};

        this._getQueryParameters(paramDictionary, urlOptions);
        var keys = Object.keys(paramDictionary);
        if (keys.length == 0)
            return null;

        var queryString = "?";
        for (var prop in paramDictionary) {
            queryString += prop + '=' + paramDictionary[prop] + '&';
        }

        queryString = queryString.substring(0, queryString.length - 1);

        return queryString;
    }

    _buildUrl() {
        // TODO
        var url = this.urlOptions.baseUrl + (this.urlOptions.entitySet || '');
        var queryString = this._getQueryString(this.urlOptions);
        if (queryString)
            url += queryString;

        return url;
    }
}

class SingleOperationRequest extends RequestBase {
    _buildUrl() {
        let url = `${this.urlOptions.baseUrl}${this.urlOptions.entitySet}(${this.query.data.key})`;
        const queryString = this._getQueryString(this.urlOptions);
        if (queryString) {
            url += queryString;
        }

        return url;
    }
}

class GetRequest extends RequestBase {
    _getMethod() {
        return 'GET';
    }

    _getQueryParameters(paramDictionary, urlOptions) {
        var clause = constants.ODataParams;

        if (urlOptions.ODataParams) {
            var query = urlOptions.ODataParams.build();
            if (utils.isString(query.$filter))
                paramDictionary[clause.$filter] = query.$filter;
            if (utils.isString(query.$select))
                paramDictionary[clause.$select] = query.$select;
            if (utils.isString(query.$expand))
                paramDictionary[clause.$expand] = query.$expand;
            if (utils.isString(query.$orderby))
                paramDictionary[clause.$orderby] = query.$orderby;
            if (utils.isNumber(query.$skip))
                paramDictionary[clause.$skip] = query.$skip;
            if (utils.isNumber(query.$top))
                paramDictionary[clause.$top] = query.$top;
            if (utils.isBoolean(query.$count))
                paramDictionary[clause.$count] = query.$count;
        }

        return super._getQueryParameters(paramDictionary, urlOptions);
    }
}

class GetByIdRequest extends SingleOperationRequest {
    _getMethod() {
        return 'GET';
    }

    _getQueryParameters(paramDictionary, urlOptions) {
        var clause = constants.ODataParams;

        if (urlOptions.ODataParams) {
            var query = urlOptions.ODataParams.build();
            if (utils.isString(query.$select)) {
                paramDictionary[clause.$select] = query.$select;
            }

            if (utils.isString(query.$expand)) {
                paramDictionary[clause.$expand] = query.$expand;
            }
        }

       super._getQueryParameters(paramDictionary, urlOptions);
    }
}

// Delete item
function DeleteRequest(options) {
    SingleOperationRequest.call(this, options);
}
utils.inheritsFrom(DeleteRequest, SingleOperationRequest);

DeleteRequest.prototype._getMethod = function () {
    return "DELETE";
}
// TODO: combine everything in a single object
// Update Request
function UpdateRequest(options) {
    this.data = options.data;
    SingleOperationRequest.call(this, options);
}
utils.inheritsFrom(UpdateRequest, SingleOperationRequest);

UpdateRequest.prototype._getMethod = function () {
    return "PATCH";
}

UpdateRequest.prototype._send = function (http) {
    utils._convertDateFieldToISOString(this.data);
    http.send(JSON.stringify(this.data));
}

UpdateRequest.prototype._setRequestHeaders = function (http) {
    SingleOperationRequest.prototype._setRequestHeaders.call(this, http);
    http.setRequestHeader("Content-Type", RequestBase.contentTypes.json);
}

// Create item
function CreateRequest(options) {
    this.data = options.data;
    RequestBase.call(this, options);
}
utils.inheritsFrom(CreateRequest, RequestBase);

CreateRequest.prototype._getMethod = function () {
    return "POST";
}

CreateRequest.prototype._send = function (http) {
    utils._convertDateFieldToISOString(this.data);
    http.send(JSON.stringify(this.data));
}

CreateRequest.prototype._setRequestHeaders = function (http) {
    RequestBase.prototype._setRequestHeaders.call(this, http);
    http.setRequestHeader("Content-Type", RequestBase.contentTypes.json);
}

function GetRelatedRequest(options) {
    this.navigationProperty = options.navigationProperty;
    GetByIdRequest.call(this, options);
}

utils.inheritsFrom(GetRelatedRequest, GetByIdRequest);

GetRelatedRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + this.urlOptions.entitySet + "(" + this.key + ")/" + this.navigationProperty;
}

function GetRelatedByIdRequest(options) {
    this.navigationProperty = options.navigationProperty;
    this.relatedKey = options.relatedKey;
    GetByIdRequest.call(this, options);
}
utils.inheritsFrom(GetRelatedByIdRequest, GetByIdRequest);

GetRelatedByIdRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + this.urlOptions.entitySet + "(" + this.key + ")/" + this.navigationProperty + "(" + this.relatedKey + ")";
}

function DeleteRelatedRequest(options) {
    this.navigationProperty = options.navigationProperty;
    DeleteRequest.call(this, options);
}
utils.inheritsFrom(DeleteRelatedRequest, DeleteRequest);

DeleteRelatedRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + this.urlOptions.entitySet + "(" + this.key + ")/" + this.navigationProperty + "/$ref";
}

function DeleteRelatedByIdRequest(options) {
    this.navigationProperty = options.navigationProperty;
    this.relatedKey = options.relatedKey
    DeleteRequest.call(this, options);
}
utils.inheritsFrom(DeleteRelatedByIdRequest, DeleteRequest);

DeleteRelatedByIdRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + this.urlOptions.entitySet + "(" + this.key + ")/" + this.navigationProperty + "(" + this.relatedKey + ")/$ref";
}

function CreateRelatedRequest(options) {
    this.navigationProperty = options.navigationProperty;
    this.key = options.key;
    CreateRequest.call(this, options);
}
utils.inheritsFrom(CreateRelatedRequest, CreateRequest);

CreateRelatedRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + this.urlOptions.entitySet + "(" + this.key + ")/" + this.navigationProperty + "/$ref";
}

function UploadRequest(options) {
    CreateRequest.call(this, options);
    this.fileName = options.fileName;
    this.data = options.data;
    this.contentType = options.contentType;
}

utils.inheritsFrom(UploadRequest, CreateRequest);

module.exports = {
    RequestBase: RequestBase,
    GetRequest: GetRequest,
    GetByIdRequest: GetByIdRequest,
    DeleteRequest: DeleteRequest,
    UpdateRequest: UpdateRequest,
    CreateRequest: CreateRequest,
    GetRelatedRequest: GetRelatedRequest,
    GetRelatedByIdRequest: GetRelatedByIdRequest,
    DeleteRelatedRequest: DeleteRelatedRequest,
    DeleteRelatedByIdRequest: DeleteRelatedByIdRequest,
    CreateRelatedRequest: CreateRelatedRequest,
    UploadRequest: UploadRequest
};