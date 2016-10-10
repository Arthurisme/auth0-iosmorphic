import rsvp from 'rsvp';
import Request from 'Request';
import {parseUtilities} from 'utils';
import RequestOptionsBuilder from 'query/RequestOptionsBuilder';
import {EverliveErrors} from 'EverliveError';

export const RequestService = {
    buildRequest(query, data) {
        const getRequestOptionsFromQuery = RequestOptionsBuilder[query.operation];
        const requestOptions = getRequestOptionsFromQuery(query);
        data._setAdditionalHeaders(query, requestOptions);
        return new Request(data.sdk.setup, requestOptions);
    },

    /**
     * Sends a request and if it must applies the result offline.
     * @param query
     * @param data
     * @param [request]
     * @returns {Promise} Resolves with the response.
     */
    handleRequestProcessing(query, data, request = this.buildRequest(query, data)) {
        return new rsvp.Promise(function (resolve, reject) {
            let successData;

            request.send()
                .then(function (res) {
                    successData = res;
                    if (query.applyOffline) {
                        return data._applyOffline(query, successData);
                    } else {
                        return successData;
                    }
                }, function (err) {
                    reject(err);
                }).then(function () {
                    resolve(successData);
                }, function (err) {
                    const notSupported = EverliveErrors.operationNotSupportedOffline.code;
                    const notFound = EverliveErrors.itemNotFound.code;
                
                    const online = !query.canUseOffline || !query.useCache;
                    if (online && (err.code === notSupported || err.code === notFound)) {
                        resolve(successData);
                    } else {
                        reject(err);
                    }
                });
        });
    },

    /**
     * Sends a request.
     * @param request
     * @returns {Promise} Resolves with the parsed response.
     */
    sendRequest(request) {
        return new rsvp.Promise(function (resolve, reject) {
            request.send()
                .then(function (res) {
                    const result = res.Result || res;
                    const reviver = parseUtilities.getReviver();
                    parseUtilities.parseResult(reviver, result);
                    resolve(result);
                }, function (err) {
                    reject(err);
                });
        });
    }
};