import {buildPromise, guardUnset} from 'utils';
import _ from 'underscore';
import {EverliveError, EverliveErrors} from 'EverliveError';
import Data from 'types/Data';
import {DataQueryOperations} from 'constants';

export default class Users extends Data {
    /**
     * @class Users
     * @extends Data
     * @protected
     */
    constructor(sdk) {
        super(sdk, 'Users');
    }

    /**
     * Registers a new user with username and password.
     * @memberOf Users.prototype
     * @method register
     * @name register
     * @param {string} username The new user's username.
     * @param {string} password The new user's password.
     * @param {object} userInfo Additional information for the user (ex. DisplayName, Email, etc.)
     * @returns {Promise} The promise for the request.
     */
    /**
     * Registers a new user using a username and a password.
     * @memberOf Users.prototype
     * @method register
     * @name register
     * @param {string} username The new user's username.
     * @param {string} password The new user's password.
     * @param attrs
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    register(username, password, attrs, success, error) {
        guardUnset(username, 'username');
        guardUnset(password, 'password');
        const user = _.extend({
            Username: username,
            Password: password,
        }, attrs);

        return this.create(user, success, error);
    }

    /**
     * Gets information about the user that is currently authenticated to the {{site.bs}} JavaScript SDK. The success function is called with [Users.ResultTypes.currentUserResult]{@link Users.ResultTypes.currentUserResult}.
     * @memberOf Users.prototype
     * @method currentUser
     * @name currentUser
     * @returns {Promise} The promise for the request.
     */
    /**
     * Gets information about the user that is currently authenticated to the {{site.bs}} JavaScript SDK. The success function is called with [Users.ResultTypes.currentUserResult]{@link Users.ResultTypes.currentUserResult}.
     * @memberOf Users.prototype
     * @method currentUser
     * @name currentUser
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    currentUser(success, error) {
        var id = this.sdk._isOfflineStorageEnabled() && this.sdk.isOffline() ? this.sdk.setup.principalId : 'me';
        return buildPromise((success, error) => {
            if (id === 'me' && !this.sdk.setup.token && !this.sdk.setup.masterKey || !id) {
                return success({result: null});
            }

            this.getById(id).then(
                res => {
                    if (typeof res.result !== 'undefined') {
                        success({result: res.result});
                    } else {
                        success({result: null});
                    }
                },
                err => {
                    if (this.sdk.authentication && this.sdk.authentication.isAuthenticationInProgress()) {
                        success({result: null});
                    } else if (err.code === 601) { // invalid request, i.e. the access token is missing
                        success({result: null});
                    } else if (err.code === 801) {
                        error(new EverliveError(EverliveErrors.invalidToken));
                    } else {
                        error(err);
                    }
                }
            );
        }, success, error);
    }

    /**
     * Changes the password of a user.
     * @memberOf Users.prototype
     * @method changePassword
     * @name changePassword
     * @param {string} username The user's username.
     * @param {string} password The user's password.
     * @param {string} newPassword The user's new password.
     * @param {boolean} keepTokens If set to true, the user tokens will be preserved even after the password change.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Changes the password of a user.
     * @memberOf Users.prototype
     * @method changePassword
     * @name changePassword
     * @param {string} username The user's username.
     * @param {string} password The user's password.
     * @param {string} newPassword The user's new password.
     * @param {boolean} keepTokens If set to true, the user tokens will be preserved even after the password change.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    changePassword(username, password, newPassword, keepTokens, success, error) {
        const data = {
            Username: username,
            Password: password,
            NewPassword: newPassword
        };
        const additionalOptions = {keepTokens};
        const dataQuery = this.buildDataQuery({data, additionalOptions}, DataQueryOperations.UserChangePassword);
        return buildPromise((success, error) => {
            return this.processDataQuery(dataQuery)
                .then(data => {
                    if (data && data.result) {
                        if (!keepTokens) {
                            this.clearAuthorization();
                        }
                    }

                    return success(data);
                })
                .catch(error);
        }, success, error);
    }

    /**
     *
     * Logs in a user using a username and a password to the current {{site.bs}} JavaScript SDK instance. All requests initiated by the current {{site.bs}} JavaScript SDK instance will be authenticated with that user's credentials.
     * @memberOf Users.prototype
     * @method login
     * @name login
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.login}
     * @param {string} username The user's username.
     * @param {string} password The user's password.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Logs in a user using a username and a password to the current {{site.bs}} JavaScript SDK instance. All requests initiated by the current {{site.bs}} JavaScript SDK instance will be authenticated with that user's credentials.
     * @memberOf Users.prototype
     * @method login
     * @name login
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.login}
     * @param {string} username The user's username.
     * @param {string} password The user's password.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    login(username, password, success, error) {
        return this.sdk.authentication.login(username, password, success, error);
    }

    /**
     * Log out the user who is currently logged in.
     * @memberOf Users.prototype
     * @method logout
     * @name logout
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.logout}
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log out the user who is currently logged in.
     * @memberOf Users.prototype
     * @method logout
     * @name logout
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.logout}
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    logout(success, error) {
        return this.sdk.authentication.logout(success, error);
    }

    /**
     * Log in a user using an Facebook access token.
     * @memberOf Users.prototype
     * @method loginWithFacebook
     * @name loginWithFacebook
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithFacebook}
     * @param {string} accessToken Facebook access token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log in a user using an Facebook access token.
     * @memberOf Users.prototype
     * @method loginWithFacebook
     * @name loginWithFacebook
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithFacebook}
     * @param {string} accessToken Facebook access token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    loginWithFacebook(accessToken, success, error) {
        return this.sdk.authentication.loginWithFacebook(accessToken, success, error);
    }

    /**
     * Links a {{site.TelerikBackendServices}} user account to a Facebook access token.
     * @memberOf Users.prototype
     * @method linkWithFacebook
     * @name linkWithFacebook
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Facebook access token that will be linked to the {{site.bs}} user account.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Links a Backend Services user with a Facebook access token.
     * @memberOf Users.prototype
     * @method linkWithFacebook
     * @name linkWithFacebook
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Facebook access token that will be linked to the {{site.bs}} user account.         * @param {Function} [success] a success callback.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    linkWithFacebook(userId, accessToken, success, error) {
        const identity = {
            Provider: 'Facebook',
            Token: accessToken
        };
        return this._linkWithProvider(identity, userId, success, error);
    }

    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Facebook token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromFacebook
     * @name unlinkFromFacebook
     * @param {string} userId The user's ID in {{site.bs}}.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Facebook token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromFacebook
     * @name unlinkFromFacebook
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    unlinkFromFacebook(userId, success, error) {
        return this._unlinkFromProvider('Facebook', userId, success, error);
    }

    /**
     * Log in a user using an ADFS access token.
     * @memberOf Users.prototype
     * @method loginWithADFS
     * @name loginWithADFS
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithADFS}
     * @param {string} accessToken ADFS access token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log in a user using an ADFS access token.
     * @memberOf Users.prototype
     * @method loginWithADFS
     * @name loginWithADFS
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithADFS}
     * @param {string} accessToken ADFS access token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    loginWithADFS(accessToken, success, error) {
        return this.sdk.authentication.loginWithADFS(accessToken, success, error);
    }

    /**
     * Links a {{site.TelerikBackendServices}} user account to an ADFS access token.
     * @memberOf Users.prototype
     * @method linkWithADFS
     * @name linkWithADFS
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The ADFS access token that will be linked to the {{site.bs}} user account.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Links a {{site.TelerikBackendServices}} user account to an ADFS access token.
     * @memberOf Users.prototype
     * @method linkWithADFS
     * @name linkWithADFS
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The ADFS access token that will be linked to the {{site.bs}} user account.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    linkWithADFS(userId, accessToken, success, error) {
        const identity = {
            Provider: 'ADFS',
            Token: accessToken
        };
        return this._linkWithProvider(identity, userId, success, error);
    }

    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the ADFS token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromADFS
     * @name unlinkFromADFS
     * @param {string} userId The user's ID in {{site.bs}}.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the ADFS token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromADFS
     * @name unlinkFromADFS
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    unlinkFromADFS(userId, success, error) {
        return this._unlinkFromProvider('ADFS', userId, success, error);
    }

    /**
     * Log in a user using a Microsoft Account access token.
     * @memberOf Users.prototype
     * @method loginWithLiveID
     * @name loginWithLiveID
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithLiveID}
     * @param {string} accessToken Microsoft Account access token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log in a user using a Microsoft Account access token.
     * @memberOf Users.prototype
     * @method loginWithLiveID
     * @name loginWithLiveID
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithLiveID}
     * @param {string} accessToken Microsoft Account access token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    loginWithLiveID(accessToken, success, error) {
        return this.sdk.authentication.loginWithLiveID(accessToken, success, error);
    }

    /**
     * Links a {{site.TelerikBackendServices}} user account to a Microsoft Account access token.
     * @memberOf Users.prototype
     * @method linkWithLiveID
     * @name linkWithLiveID
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Microsoft Account access token that will be linked to the {{site.bs}} user account.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Links a {{site.TelerikBackendServices}} user account to a Microsoft Account access token.
     * @memberOf Users.prototype
     * @method linkWithLiveID
     * @name linkWithLiveID
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Microsoft Account access token that will be linked to the {{site.bs}} user account.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    linkWithLiveID(userId, accessToken, success, error) {
        const identity = {
            Provider: 'LiveID',
            Token: accessToken
        };
        return this._linkWithProvider(identity, userId, success, error);
    }

    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Microsoft Account access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromLiveID
     * @name unlinkFromLiveID
     * @param {string} userId The user's ID in {{site.bs}}.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Microsoft Account access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromLiveID
     * @name unlinkFromLiveID
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    unlinkFromLiveID(userId, success, error) {
        return this._unlinkFromProvider('LiveID', userId, success, error);
    }

    /**
     * Log in a user using a Google access token.
     * @memberOf Users.prototype
     * @method loginWithGoogle
     * @name loginWithGoogle
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithGoogle}
     * @param {string} accessToken Google access token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log in a user using a Google access token.
     * @memberOf Users.prototype
     * @method loginWithGoogle
     * @name loginWithGoogle
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.loginWithGoogle}
     * @param {string} accessToken Google access token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    loginWithGoogle(accessToken, success, error) {
        return this.sdk.authentication.loginWithGoogle(accessToken, success, error);
    }

    /**
     * Links a {{site.TelerikBackendServices}} user account to a Google access token.
     * @memberOf Users.prototype
     * @method linkWithGoogle
     * @name linkWithGoogle
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Google access token that will be linked to the {{site.bs}} user account.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Links a {{site.TelerikBackendServices}} user account to a Google access token.
     * @memberOf Users.prototype
     * @method linkWithGoogle
     * @name linkWithGoogle
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} accessToken The Google access token that will be linked to the {{site.bs}} user account.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    linkWithGoogle(userId, accessToken, success, error) {
        const identity = {
            Provider: 'Google',
            Token: accessToken
        };
        return this._linkWithProvider(identity, userId, success, error);
    }

    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Google access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromGoogle
     * @name unlinkFromGoogle
     * @param {string} userId The user's ID in {{site.bs}}.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Google access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromGoogle
     * @name unlinkFromGoogle
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    unlinkFromGoogle(userId, success, error) {
        return this._unlinkFromProvider('Google', userId, success, error);
    }

    /**
     * Log in a user with a Twitter token. A secret token needs to be provided.
     * @memberOf Users.prototype
     * @method loginWithTwitter
     * @name loginWithTwitter
     * @param {string} token Twitter token.
     * @param {string} tokenSecret Twitter secret token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Log in a user with a Twitter token. A secret token needs to be provided.
     * @memberOf Users.prototype
     * @method loginWithTwitter
     * @name loginWithTwitter
     * @param {string} token Twitter token.
     * @param {string} tokenSecret Twitter secret token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    loginWithTwitter(token, tokenSecret, success, error) {
        return this.sdk.authentication.loginWithTwitter(token, tokenSecret, success, error);
    }

    /**
     * Links a {{site.TelerikBackendServices}} user to a Twitter token. A secret token needs to be provided.
     * @memberOf Users.prototype
     * @method linkWithTwitter
     * @name linkWithTwitter
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} token The Twitter access token that will be linked to the {{site.bs}} user account.
     * @param {string} tokenSecret The Twitter secret token.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Links a {{site.TelerikBackendServices}} user to a Twitter token. A secret token needs to be provided.         * Links a Backend Services user with a Twitter token. A secret token needs to be provided.
     * @memberOf Users.prototype
     * @method linkWithTwitter
     * @name linkWithTwitter
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {string} token The Twitter access token that will be linked to the {{site.bs}} user account.
     * @param {string} tokenSecret The Twitter secret token.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    linkWithTwitter(userId, token, tokenSecret, success, error) {
        const identity = {
            Provider: 'Twitter',
            Token: token,
            TokenSecret: tokenSecret
        };
        return this._linkWithProvider(identity, userId, success, error);
    }

    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Twitter access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromTwitter
     * @name unlinkFromTwitter
     * @param {string} userId The user's ID in {{site.bs}}.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Unlinks a {{site.TelerikBackendServices}} user account from the Twitter access token that it is linked to.
     * @memberOf Users.prototype
     * @method unlinkFromTwitter
     * @name unlinkFromTwitter
     * @param {string} userId The user's ID in {{site.bs}}.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    unlinkFromTwitter(userId, success, error) {
        return this._unlinkFromProvider('Twitter', userId, success, error);
    }

    /**
     * Sets the token and token type that the {{site.TelerikBackendServices}} JavaScript SDK will use for authorization.
     * @memberOf Users.prototype
     * @method setAuthorization
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.setAuthorization}
     * @param {string} token Token that will be used for authorization.
     * @param {Everlive.TokenType} tokenType Token type. Currently only 'bearer' token is supported.
     * @param {string} principalId The id of the user that is logged in.
     */
    setAuthorization(token, tokenType, principalId) {
        this.sdk.authentication.setAuthorization(token, tokenType, principalId)
    }

    /**
     * Clears the authentication token that the {{site.bs}} JavaScript SDK currently uses. Note that this is different than logging out, because the current authorization token is not invalidated.
     * @method clearAuthorization
     * @deprecated
     * @see [authentication.login]{@link ../Authentication/authentication.clearAuthorization}
     * @memberOf Users.prototype
     */
    clearAuthorization() {
        this.sdk.authentication.setAuthorization(null, null, null);
    }

    /**
     * Sends a password reset email to a specified user.
     * @memberOf Users.prototype
     * @method resetPassword
     * @name resetPassword
     * @param {Object} user The user object, which must container either username or email address.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Sends a password reset email to a specified user.
     * @memberOf Users.prototype
     * @method resetPassword
     * @name resetPassword
     * @param {Object} user The user object, which must container either username or email address.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    resetPassword(user, success, error) {
        const dataQuery = this.buildDataQuery(user, DataQueryOperations.UserResetPassword);
        return this.processDataQuery(dataQuery, success, error);
    }

    /**
     * Set a new password for a user using a password reset code.
     * @memberOf Users.prototype
     * @method setPassword
     * @name setPassword
     * @param {object} setPasswordObject The object, which contains information necessary for changing the user password.
     * @param {string} setPasswordObject.ResetCode The reset code obtained using a password reset email.
     * @param {string} setPasswordObject.NewPassword The new password for the user.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Set a new password for a user using a password reset code.
     * @memberOf Users.prototype
     * @method setPassword
     * @name setPassword
     * @param {object} setPasswordObject The object, which contains information necessary for changing the user password.
     * @param {string} setPasswordObject.ResetCode The reset code obtained using a password reset email.
     * @param {string} setPasswordObject.NewPassword The new password for the user.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    /**
     * Set a new password for a user using a password reset code.
     * @memberOf Users.prototype
     * @method setPassword
     * @name setPassword
     * @param {object} setPasswordObject The object, which contains information necessary for changing the user password.
     * @param {number} setPasswordObject.Username The username that the password will be changed.
     * @param {number} setPasswordObject.SecretQuestionId The id of the secret question.
     * @param {string} setPasswordObject.SecretAnswer The answer to the secret question.
     * @param {string} setPasswordObject.NewPassword The new password for the user.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Set a new password for a user using a password reset code.
     * @memberOf Users.prototype
     * @method setPassword
     * @name setPassword
     * @param {object} setPasswordObject The object, which contains information necessary for changing the user password.
     * @param {number} setPasswordObject.Username The username that the password will be changed.
     * @param {number} setPasswordObject.SecretQuestionId The id of the secret question.
     * @param {string} setPasswordObject.SecretAnswer The answer to the secret question.
     * @param {string} setPasswordObject.NewPassword The new password for the user.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    setPassword(setPasswordObject, success, error) {
        const dataQuery = this.buildDataQuery(setPasswordObject, DataQueryOperations.UserSetPassword);
        return this.processDataQuery(dataQuery, success, error);
    }

    _linkWithProvider(identity, userId, success, error) {
        const dataQuery = this.buildDataQuery({
            additionalOptions: {
                id: userId
            },
            data: identity
        }, DataQueryOperations.UserLinkWithProvider);
        return this.processDataQuery(dataQuery, success, error);
    }

    _unlinkFromProvider(providerName, userId, success, error) {
        const dataQuery = this.buildDataQuery({
            additionalOptions: {id: userId},
            data: {
                Provider: providerName
            }
        }, DataQueryOperations.UserUnlinkFromProvider);
        return this.processDataQuery(dataQuery, success, error);
    }
}