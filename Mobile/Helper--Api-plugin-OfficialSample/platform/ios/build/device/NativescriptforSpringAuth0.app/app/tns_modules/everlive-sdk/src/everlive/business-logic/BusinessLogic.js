import path from 'path';
import constants, {DataQueryOperations} from 'constants';
import _ from 'underscore';
import utils, {buildPromise} from 'utils';
import {EverliveError, EverliveErrors} from 'EverliveError';
import Data from 'types/Data';

export default class BusinessLogic extends Data {
    static _isValidFuncName(name) {
        return _.isString(name) && name !== '';
    }

    /**
     * @class BusinessLogic
     * @classdesc A class for invoking your app's Business Logic such as Cloud Functions and Stored Procedures.
     * @protected
     * @param sdk {Everlive} The sdk instance
     * @param setup {Object} Everlive setup object.
     */
    constructor(sdk) {
        super(sdk, 'BusinessLogic');
    }

    _invokeFunction(params, operation) {
        const {
            customParameters,
            method,
            endpoint,
            success,
            error
        } = params;

        const additionalOptions = _.extend({
            customParameters,
            method,
            endpoint,
            authHeaders: true,
            isCustomRequest: true
        }, params);
        const dataQuery = this.buildDataQuery({additionalOptions}, operation);
        return this.processDataQuery(dataQuery, success, error);
    }

    /**
     * Invokes a Cloud Function from the app's Business Logic layer.
     * @method invokeCloudFunction
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the function to invoke.
     * @param {Object} params An object containing all invocation request parameters.
     * @param {HttpMethod} [params.method=GET] HTTP request method.
     * @param {Object} [params.queryStringParams] Parameters to be passed in the query string.
     * @param {Object} [params.data] Data to be sent with the request.
     * @param {Boolean} [params.authHeaders=true] Whether to send the credentials of the currently logged-in user.
     * @param {Object} [params.headers] Additional headers to be sent with the request.
     * @param {Object} [params.customParameters] Custom parameters to be sent with the request. They will be accessible in the Cloud Function code.
     * @returns {Promise} A promise resolved on successful response and rejected on error response.
     */
    /**
     * Invokes a Cloud Function from the app's Business Logic layer.
     * @method invokeCloudFunction
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the function to invoke.
     * @param {Object} params An object containing all invocation request parameters.
     * @param {HttpMethod} [params.method=GET] HTTP request method.
     * @param {Object} [params.queryStringParams] Parameters to be passed in the query string.
     * @param {Object} [params.data] Data to be sent with the request.
     * @param {Boolean} [params.authHeaders=true] Whether to send the credentials of the currently logged-in user.
     * @param {Object} [params.headers] Additional headers to be sent with the request.
     * @param {Object} [params.customParameters] Custom parameters to be sent with the request. They will be accessible in the Cloud Function code.
     * @param {Function} success Success callback function.
     * @param {Function} error Error callback function.
     */
    invokeCloudFunction(funcName, params, success, error) {
        if (!BusinessLogic._isValidFuncName(funcName)) {
            const err = new EverliveError(EverliveErrors.invalidOrMissingFunctionName);
            return utils.callbackAndPromiseErrorResponse(err, error);
        }

        params = _.extend({
            method: constants.HttpMethod.GET,
            success: success,
            error: error
        }, params);

        if (params.method.toUpperCase() === constants.HttpMethod.GET && _.size(params.data)) {
            const err = new EverliveError(EverliveErrors.bodyWithGetRequestNotSupported);
            return utils.callbackAndPromiseErrorResponse(err, error);
        }

        params.endpoint = path.join(constants.cloudFuncsEndpoint, funcName);
        return this._invokeFunction(params, DataQueryOperations.InvokeCloudFunction);
    }

    /**
     * Invokes a Stored Procedure from the app's Business Logic layer.
     * @method invokeStoredProcedure
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the Stored Procedure to invoke.
     * @param {Object} funcParams Parameters to be passed to the Stored Procedure.
     * @returns {Promise} A promise resolved on successful response and rejected on error response.
     */
    /**
     * Invokes a Stored Procedure from the app's Business Logic layer.
     * @method invokeStoredProcedure
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the stored procedure to invoke.
     * @param {Object} funcParams Parameters to be passed to the Stored Procedure.
     * @param {Function} success Success callback function.
     * @param {Function} error Error callback function.
     */
    invokeStoredProcedure(funcName, funcParams, success, error) {
        if (!BusinessLogic._isValidFuncName(funcName)) {
            const err = new EverliveError(EverliveErrors.invalidOrMissingProcedureName);
            return utils.callbackAndPromiseErrorResponse(err, error);
        }

        const reqParams = {
            method: constants.HttpMethod.POST,
            endpoint: path.join(constants.sqlProceduresEndpoint, funcName),
            data: funcParams || {},
            success: success,
            error: error
        };

        return this._invokeFunction(reqParams, DataQueryOperations.InvokeStoredProcedure);
    }
}