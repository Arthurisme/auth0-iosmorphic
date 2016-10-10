const http = require('http');
import rsvp from 'rsvp';
import constants from 'constants';

// NodeJS nulls header name casing by lowering all casing,
// we simulate this in NS with this function to avoid header name issues
function getCaseInsensitiveHeaders (headers) {
    var result = {};

    for (var headerName in headers) {
        if (headers.hasOwnProperty(headerName)) {
            result[headerName.toLowerCase()] = headers[headerName];
        }
    }

    return result;
}

module.exports = (function () {
    'use strict';

    function reqwest(options) {
        var httpRequestOptions = {
            url: options.url,
            method: options.method,
            headers: options.headers || {}
        };

        if (options.data) {
            httpRequestOptions.content = options.data; // NOTE: If we pass null/undefined, it will raise an exception in the http module.
        }

        httpRequestOptions.headers[constants.Headers.ContentType] = httpRequestOptions.contentType || 'application/json';

        return new rsvp.Promise(function (resolve, reject) {
            return http.request(httpRequestOptions)
                .then(function (response) {
                    const contentString = response.content.toString();
                    const content = JSON.parse(contentString);
                    if (response.statusCode < 400) {
                        resolve(content);
                    } else {
                        reject(contentString);
                    }
                }, function (error) {
                    // possible reasons: no internet connectivity
                    // error is an object with message (contains the reason) and stack (null)
                    reject(error);
                });
        });
    }

    return reqwest;
}());