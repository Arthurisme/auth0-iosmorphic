/**
 * @typedef Everlive.Callbacks
 * @description Defines callback functions used throughout the SDK.
 */

/**
 * A function that is called when [authentication.getAuthenticationStatus]{@link ../Authentication/Authentication.getAuthenticationStatus} is executed successfully.
 * @function Everlive.Callbacks.authenticationStatusSuccess
 * @param {Everlive.ResultTypes.authenticationStatusResult} authResult The authentication status success function result.
 */

/**
 * A function that is called when an error occurs during the execution of [authentication.getAuthenticationStatus]{@link ../Authentication/Authentication.getAuthenticationStatus}.
 * @function Everlive.Callbacks.authenticationStatusError
 * @param {Everlive.ResultTypes.authenticationStatusError} authResult The error that occurred during authentication.
 */