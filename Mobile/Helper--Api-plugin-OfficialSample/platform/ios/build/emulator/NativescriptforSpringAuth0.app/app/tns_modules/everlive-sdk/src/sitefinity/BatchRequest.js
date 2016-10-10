﻿var Request = require('Request');
var CreateRequest = Request.CreateRequest;
var UpdateRequest = Request.UpdateRequest;
var UploadRequest = Request.UploadRequest;
var RequestBase = Request.RequestBase;
var CreateRelatedRequest = Request.CreateRelatedRequest;
var utils = require('utils');

/**
 * @classdesc The transaction class is used to group operations that involve data manipulation together and execute them as a single atomic operation.
 * @class Transaction
 * @param {object} urlOptions - The url options that are passed to the {@link _factory} object.
 * @param {object} _factory - The factory object used for request generation.
 */
function Transaction(urlOptions, _factory) {
    this.urlOptions = urlOptions;
    this._factory = _factory;
    this._requests = [];
    this._counter = 0;
}

Transaction.prototype.upload = function (parameters) {
    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        data: parameters.data,
        contentType: parameters.contentType,
        fileName: parameters.fileName
    };

    var request = this._factory.upload(options);

    return this.addRequest(this, request);
}

/**
* Adds a POST request to create a single item.
* @memberOf Transaction
* @instance
* @param {object} parameters - The parameters for the request.
* @param {object} parameters.data - The payload of the request.
*/
Transaction.prototype.create = function (parameters) {
    if (!(parameters || parameters.entitySet))
        throw "entitySet is required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        data: parameters.data
    };

    var request = this._factory.create(options);

    return this.addRequest(this, request);
}

/**
* Adds a PATCH request to update a single item.
* @memberOf Transaction
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item to be updated.
* @param {object} parameters.data - The payload of the request.
*/
Transaction.prototype.update = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key || parameters.data))
        throw "parameters: entitySet, key and data are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        data: parameters.data
    };

    var request = this._factory.update(options);

    this._overrideUrlGeneration(request, parameters.key);

    this.addRequest(this, request);
}

/**
* Adds a DELETE request to delete a single item.
* @memberOf Transaction
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item to be deleted.
*/
Transaction.prototype.destroy = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key))
        throw "parameters: entitySet and key are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key
    };

    var request = this._factory.destroy(options);

    this._overrideUrlGeneration(request, parameters.key);

    this.addRequest(this, request);
}

/**
* Adds a DELETE request to retrieve the delete all of the associated members in the relation property.
* @memberOf Transaction
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.navigationProperty - The name of the navigation property.
*/
Transaction.prototype.destroyRelated = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key))
        throw "parameters: entitySet and key are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        navigationProperty: parameters.navigationProperty
    };

    var request = this._factory.destroyRelated(options);

    this._overrideUrlGeneration(request, parameters.key);

    this.addRequest(this, request);
}

/**
* Adds a DELETE request to retrieve the a single entry of the associated members in the relation property.
* @memberOf Transaction
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.navigationProperty - The name of the navigation property.
* @param {string} parameters.relatedKey - The identifier of the related item.
*/
Transaction.prototype.destroyRelatedById = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key || parameters.relatedKey || parameters.navigationProperty))
        throw "parameters: entitySet, key, relatedKey and navigationProperty are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        relatedKey: parameters.relatedKey,
        navigationProperty: parameters.navigationProperty
    };

    var request = this._factory.destroyRelatedById(options);

    this.addRequest(this, request);
}

/**
* Adds a POST request to add a related item to the property collection.
* @memberOf Transaction
* @instance
* @see {@link Data.createRelated}
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.navigationProperty - The name of the navigation property
*/
Transaction.prototype.createRelated = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key || parameters.link || parameters.navigationProperty))
        throw "parameters: entitySet, key, link and navigationProperty are required!";

    // TODO: rethink about the urls
    var urlOptions = this.urlParametersClone(parameters.entitySet);

    for (var req in this._requests) {
        if (this._requests[req].id == parameters.link) {
            parameters.link = "$" + this._requests[req].id;
        }
    }

    var data = {
        '@odata.id': parameters.link
    }

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        navigationProperty: parameters.navigationProperty,
        data: data
    };

    var request = this._factory.createRelated(options);

    this._overrideUrlGeneration(request, parameters.key);

    return this.addRequest(this, request);
}
Transaction.prototype._overrideUrlGeneration = function (request, key) {
    // TODO: match requests with Content-ID's!
    // Content-ID's are the same as id's in _requests.
    for (var req in this._requests) {
        if (this._requests[req].id == key) {
            request._buildUrl = function () { return "$" + key}
        }
    }
}

Transaction.prototype.addRequest = function (that, request) {
    that._requests.push({ "id": that._counter, "request": request });
    return that._counter++;
}

Transaction.prototype.urlParametersClone = function (entitySet) {
    var options = utils.clone(this.urlOptions);
    options.entitySet = entitySet;

    return options;
}

/**
 * @classdesc The batch request class is used for grouping requests into a single batch request to execute on the server.
 * @class BatchRequest
 */
function BatchRequest(options) {
    CreateRequest.call(this, options);
    this._factory = options._factory;
    this._requests = [];
    this._counter = 0;
    this.boundary = this._createBoundary("sf_batch_");
    this.responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;
    this.responseStatusRegex = /^HTTP\/1\.\d (\d{3}) (.*)$/i;
}
utils.inheritsFrom(BatchRequest, CreateRequest);

BatchRequest.constants = {
    newLine: '\r\n'
}

/**
* Adds a GET request to retrieve a collection of items.
* @memberOf BatchRequest
* @instance
* @param {object} parameters - The parameters for the request.
* @param {object} parameters.query - The {@link WhereQuery} with which to filter the items
*/
BatchRequest.prototype.get = function (parameters) {
    if (!(parameters || parameters.entitySet))
        throw "entitySet is required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);
    if (parameters && parameters.query)
        urlOptions.ODataParams = parameters.query;

    var options = {
        urlOptions: urlOptions
    };

    var request = this._factory.get(options);

    this.addRequest(request);
}

/**
* Adds a GET request for the retrieval of a single item.
* @memberOf BatchRequest
* @instance
* @param {object} parameters - The parameters for the request.
* @param {object} parameters.query - The {@link QueryBase} object containing the OData query options that should be sent to the server.
* @param {string} parameters.key - The identifier of the item to be retrieved.
*/
BatchRequest.prototype.getSingle = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key))
        throw "parameters: entitySet and key are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    if (parameters.query)
        option.ODataParams = parameters.query;

    var options = {
        urlOptions: urlOptions,
        key: parameters.key
    };

    var request = this._factory.getSingle(options);

    this.addRequest(request);
}

/**
* Adds a GET request to get the property of a single item.
* @memberOf BatchRequest
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.property - The name of the property to be retrieved.
*/
BatchRequest.prototype.getProperty = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key, parameters.property))
        throw "parameters: entitySet, key and property are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        navigationProperty: parameters.property
    };

    var request = this._factory.getProperty(options);

    this.addRequest(request);
}

/**
* Adds a GET request to get the related property value of a single item. 
* @memberOf BatchRequest
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.navigationProperty - The name of the navigation property to be retrieved.
*/
BatchRequest.prototype.getRelated = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key || parameters.navigationProperty))
        throw "parameters: entitySet, key and navigationProperty are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        navigationProperty: parameters.navigationProperty
    };

    var request = this._factory.getRelated(options);

    this.addRequest(request);
}

/**
* Adds a GET request to retrieve the related property value of a single item by the id of the related item.
* @memberOf BatchRequest
* @instance
* @param {object} parameters - The parameters for the request.
* @param {string} parameters.key - The identifier of the item.
* @param {string} parameters.navigationProperty - The name of the navigation property to be retrieved.
* @param {string} parameters.relatedKey - The identifier of the related item.
*/
BatchRequest.prototype.getRelatedById = function (parameters) {
    if (!(parameters || parameters.entitySet || parameters.key || parameters.relatedKey || parameters.navigationProperty))
        throw "parameters: entitySet, key, relatedKey and navigationProperty are required!";

    var urlOptions = this.urlParametersClone(parameters.entitySet);

    var options = {
        urlOptions: urlOptions,
        key: parameters.key,
        relatedKey: parameters.relatedKey,
        navigationProperty: parameters.navigationProperty
    };

    var request = this._factory.getRelatedById(options);

    this.addRequest(request);
}

/**
* Begins a transaction.
* @memberOf BatchRequest
* @instance
* @returns {@link Transaction}
*/
BatchRequest.prototype.beginTransaction = function () {
    var option = utils.clone(this.urlOptions);
    newTransaction = new Transaction(option, this._factory);
    newTransaction.id = ++this._counter;
    return newTransaction;
}

/**
* Ends a transaction.
* @memberOf BatchRequest
* @instance
*/
BatchRequest.prototype.endTransaction = function (transaction) {
    this._requests.push({
        id: transaction.id,
        request: transaction
    });
}

BatchRequest.prototype.execute = function () {
    this._execute();
}

BatchRequest.prototype._setRequestHeaders = function (http) {
    // cool hack. skipping one level calling in the hierarchy
    RequestBase.prototype._setRequestHeaders.call(this, http);
    var contentType = "multipart/mixed; boundary=" + this.boundary;
    http.setRequestHeader(RequestBase.headers.contentType, contentType);
}

BatchRequest.prototype._send = function (http) {
    var body = this._buildRequestBody();
    http.send(body);
}

BatchRequest.prototype._buildUrl = function () {
    return this.urlOptions.baseUrl + "$batch";
}

BatchRequest.prototype._parseResponse = function (http) {
    var context = {
        position: 0,
        boundaries: []
    };

    var pos = context.position;
    var partHeaders = this._readHeaders(http.getAllResponseHeaders(), context);
    var partContentType = this._contentType(partHeaders["Content-Type"]);
    if (partContentType && partContentType.mediaType == "multipart/mixed")
        context.boundaries.push(partContentType.properties.boundary);
    context.position = pos;

    var response = this._parseBatchResponse(http.responseText, context);
    var responseParsed = [];
    for (var i = 0; i < response.length; i++) {
        try {
            var changesets = response[i].__changeResponses;
            if (changesets) {
                var changesetResult = [];
                for (var change in changesets) {
                    changesetResult.push({ data: (changesets[change].response.body.length > 0) ? JSON.parse(changesets[change].response.body) : changesets[change].response.body, statusCode: changesets[change].response.statusCode, headers: changesets[change].response.headers });
                }
                responseParsed.push(changesetResult);
            }
            else
                responseParsed.push({ data: JSON.parse(response[i].response.body), statusCode: response[i].response.statusCode, headers: response[i].response.headers });
        }
        catch (e) {
            // TODO: why continue ?
            continue;
        }
    }

    return responseParsed;
}

BatchRequest.prototype._parseBatchResponse = function (text, context) {
    // get boundary from response
    var delimiter = "--" + this._currentBoundary(context);
    this._readTo(text, delimiter, context);
    this._readLine(text, context);

    var responses = [];
    var partEnd;
    while (partEnd !== "--" && context.position < text.length) {
        var partHeaders = this._readHeaders(text, context);
        var partContentType = this._contentType(partHeaders["Content-Type"]);
        var changeResponses;
        if (partContentType && partContentType.mediaType === "multipart/mixed") {
            context.boundaries.push(partContentType.properties.boundary);

            try {
                changeResponses = this._parseBatchResponse(text, context);
            } catch (e) {
                e.response = this._readResponse(text, context, delimiter);
                changeResponses = [e];
            }
            responses.push({ __changeResponses: changeResponses });
            context.boundaries.pop();
            this._readTo(text, "--" + this._currentBoundary(context), context);
        } else {
            if (!partContentType || partContentType.mediaType !== "application/http") {
                throw { message: "invalid MIME part type " };
            }
            // Skip empty line
            this._readLine(text, context);

            // Read the response
            var response = this._readResponse(text, context, delimiter);

            try {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    response = { message: response.statusCode + " Http request is OK", response: response };
                } else {
                    // Keep track of failed responses and continue processing the batch.
                    response = { message: "HTTP request failed", response: response };
                }
            } catch (e) {
                response = e;
            }

            responses.push(response);
        }

        partEnd = text.substr(context.position, 2);

        // Ignore the incoming line.
        this._readLine(text, context);
    }

    return responses;
}

BatchRequest.prototype._currentBoundary = function (context) {
    var boundaries = context.boundaries;
    return boundaries[boundaries.length - 1];
}

BatchRequest.prototype._contentType = function (str) {

    if (!str) {
        return null;
    }

    var contentTypeParts = str.split(";");
    var properties = {};

    var i, len;
    for (i = 1, len = contentTypeParts.length; i < len; i++) {
        var contentTypeParams = contentTypeParts[i].split("=");
        properties[contentTypeParams[0].replace(/^\s+|\s+$/g, '')] = contentTypeParams[1];
    }

    return { mediaType: contentTypeParts[0].replace(/^\s+|\s+$/g, ''), properties: properties };
}

BatchRequest.prototype._readTo = function (text, str, context) {
    var start = context.position || 0;
    var end = text.length;
    if (str) {
        end = text.indexOf(str, start);
        if (end === -1) {
            return null;
        }
        context.position = end + str.length;
    } else {
        context.position = end;
    }

    return text.substring(start, end);
}

BatchRequest.prototype._readLine = function (text, context) {
    return this._readTo(text, BatchRequest.constants.newLine, context);
}

BatchRequest.prototype._readHeaders = function (text, context) {
    var headers = {};
    var parts;
    var line;
    var pos;

    do {
        pos = context.position;
        line = this._readLine(text, context);
        parts = this.responseHeaderRegex.exec(line);
        if (parts !== null) {
            headers[parts[1]] = parts[2];
        } else {
            // Whatever was found is not a header, so reset the context position.
            context.position = pos;
        }
    } while (line && parts);

    return headers;
}

BatchRequest.prototype._readResponse = function (text, context, delimiter) {
    // Read the status line.
    var pos = context.position;
    var match = this.responseStatusRegex.exec(this._readLine(text, context));

    var statusCode;
    var statusText;
    var headers;

    if (match) {
        statusCode = match[1];
        statusText = match[2];
        headers = this._readHeaders(text, context);
        this._readLine(text, context);
    } else {
        context.position = pos;
    }

    return {
        statusCode: statusCode,
        statusText: statusText,
        headers: headers,
        body: this._readTo(text, "\r\n" + delimiter, context)
    };
}

BatchRequest.prototype._buildRequestBody = function () {
    var requestBody = '';

    for (var index in this._requests) {

        var request = this._requests[index].request;
        if (index != 0)
            requestBody += BatchRequest.constants.newLine + BatchRequest.constants.newLine;

        requestBody += "--" + this.boundary;

        if (request instanceof Transaction) {
            requestBody += this._buildTransaction(request);
        }
        else {
            requestBody += this._buildRequest(request);
        }
    }

    requestBody += this._createDelimeter(this.boundary, true);
    return requestBody;
}

BatchRequest.prototype._buildRequest = function (request) {
    var requestBody = BatchRequest.constants.newLine + 'Content-Type: application/http';
    requestBody += BatchRequest.constants.newLine + 'Content-Transfer-Encoding: binary';
    requestBody += BatchRequest.constants.newLine +
        BatchRequest.constants.newLine +
        request._getMethod() +
        ' ' + request._buildUrl() + ' HTTP/1.1';

    return requestBody;
    // no posts or patches
    /*if (boundaryRequests[req].request instanceof CreateRequest || boundaryRequests[req].request instanceof UpdateRequest) {
        requestBody += '\r\nContent-Type: application/json;odata.metadata=minimal';
        requestBody += '\r\n\r\n' + boundaryRequests[req].request.data;
    }*/
}

BatchRequest.prototype._buildTransaction = function (transaction) {
    if (transaction._requests.length == 0)
        return;

    var requestBody = BatchRequest.constants.newLine;

    var changeset = this._createBoundary("sf_changeset_");
    requestBody += 'Content-Type: multipart/mixed; boundary=' + changeset;

    var changesetRequests = transaction._requests;
    for (var reqIndex in changesetRequests) {
        var currentRequest = changesetRequests[reqIndex].request;

        requestBody += this._createDelimeter(changeset, false);
        requestBody += BatchRequest.constants.newLine + 'Content-Type: application/http'
        requestBody += BatchRequest.constants.newLine + 'Content-Transfer-Encoding: binary'
        requestBody += BatchRequest.constants.newLine + 'Content-ID: ' + changesetRequests[reqIndex].id;

        var requestUrl = currentRequest._buildUrl();
        requestBody += '\r\n\r\n' + currentRequest._getMethod() + ' ' + requestUrl + ((currentRequest instanceof CreateRelatedRequest) ? '/' + currentRequest.navigationProperty + '/$ref' : '') + ' HTTP/1.1';

        // TODO: each method should have a toString()
        if (currentRequest instanceof CreateRequest || currentRequest instanceof UpdateRequest) {
            if (currentRequest instanceof UploadRequest) {
                requestBody += BatchRequest.constants.newLine + RequestBase.headers.contentType + ": " + currentRequest.contentType;
                requestBody += BatchRequest.constants.newLine + 'X-File-Name: ' + currentRequest.fileName;
                requestBody += BatchRequest.constants.newLine + 'Content-Encoding: base64';
            }
            else
                requestBody += BatchRequest.constants.newLine + RequestBase.headers.contentType + ": " + RequestBase.contentTypes.json;

            requestBody += '\r\n\r\n' + currentRequest.data;
        }
    }

    requestBody += this._createDelimeter(changeset, true);

    return requestBody;
}

BatchRequest.prototype._createDelimeter = function (boundary, close) {
    var result = BatchRequest.constants.newLine +
        BatchRequest.constants.newLine
        + "--" + boundary;
    if (close)
        result += "--";
    return result;
}

BatchRequest.prototype._createBoundary = function (prefix) {
    return prefix + utils.hex16() + '-' + utils.hex16() + '-' + utils.hex16();
}

BatchRequest.prototype.addRequest = function (request) {
    return Transaction.prototype.addRequest(this, request);
}

BatchRequest.prototype.urlParametersClone = function (entitySet) {
    return Transaction.prototype.urlParametersClone.call(this, entitySet);
}

module.exports = BatchRequest;