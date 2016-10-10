import {CreateRequest} from 'Request';
import _ from 'underscore';

/**
* @class Authentication
* @classdesc The constructor of the Authentication object. This object is used for authenticating a user to Sitefinity.
* @param {object} options - An object containing configuration options for the {@Link Authentication} object.
* @param {string} options.serviceUrl - Your service url that points to the configured instance of Sitefinity service.
*/
function Authentication(options) {
    this._token = null;
    this._serviceUrl = options.serviceUrl;
}

/**
* Logins the user. A service call is made to login the user. If the call is successful and the service returns a token, this token is cached in the {@link Authentication} object.
* @memberOf Authentication
* @instance
* @param {string} username - The username.
* @param {string} password - The password.
* @param {Function} [success] - The success handler of the method.
* @param {Function} [failure] - The error handler of the method.
* @example
* sf.authentication.login("username", "password", successCb, failureCb);
*/
Authentication.prototype.login = function (query) {
    const requestOptions = _.extend({}, { data: query.data },
        {
            urlOptions: {
                baseUrl: this._serviceUrl + 'login'
            },
            successCb: (data) => {
                this.setToken(data.value);
                query.onSuccess(data.value);
            },
            failureCb: query.onError
        });

    const request = new CreateRequest(requestOptions);
    request._execute();
};

/**
* Logouts the user.
* @memberOf Authentication
* @instance
* @param {Function} [success] - The success handler of the method.
* @param {Function} [failure] - The error handler of the method.
*/
Authentication.prototype.logout = function (query) {
    const requestOptions = {
        urlOptions: {
            baseUrl: this._serviceUrl + 'logout',
            token: this.getToken()
        },
        successCb: (data) => {
            this.setToken(null);
            query.onSuccess(data);
        },
        failureCb: query.onError
    };

    var request = new CreateRequest(requestOptions);
    request._execute();
};

/**
* Sets the authentication token.
* @memberOf Authentication
* @instance
* @param {string} token - The token, which will be used for authentication.
*/
Authentication.prototype.setToken = function (token) {
    this._token = token;
};

/**
* Gets the authentication token.
* @memberOf Authentication
* @instance
* @returns {string}
*/
Authentication.prototype.getToken = function () {
    return this._token;
};

module.exports = Authentication;