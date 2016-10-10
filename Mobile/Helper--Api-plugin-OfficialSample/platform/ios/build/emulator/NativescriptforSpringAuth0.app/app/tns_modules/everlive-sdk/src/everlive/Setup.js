import _ from 'underscore';
import constants from 'constants';
import AuthenticationSetup from 'auth/AuthenticationSetup';

module.exports = (function () {
    var everliveUrl = constants.everliveUrl;

    // An object that keeps information about an Everlive connection
    function Setup(options) {
        this.url = everliveUrl;
        this.appId = null;
        this.masterKey = null;
        this.token = null;
        this.tokenType = null;
        this.principalId = null;
        this.scheme = 'http'; // http or https
        this.parseOnlyCompleteDateTimeObjects = false;

        if (typeof options === 'string') {
            this.appId = options;
        } else {
            this._emulatorMode = options.emulatorMode;
            _.extend(this, options);
            if(options.apiKey) {
                this.appId = options.apiKey; // backward compatibility
            }
        }

        this.apiKey = this.appId;

        this.authentication = new AuthenticationSetup(this, options.authentication);
    }

    Setup.prototype.setAuthorizationProperties = function (token, tokenType, principalId) {
        this.token = token;
        this.tokenType = tokenType;
        this.principalId = principalId;
    };

    Setup.prototype.getAuthorizationProperties = function () {
        return {
            token: this.token,
            tokenType: this.tokenType,
            principalId: this.principalId
        };
    };

    return Setup;

}());