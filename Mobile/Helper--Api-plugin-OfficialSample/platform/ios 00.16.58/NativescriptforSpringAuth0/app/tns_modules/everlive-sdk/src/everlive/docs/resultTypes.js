/**
 * @typedef Everlive.ResultTypes
 * @description Defines result types returned by functions throughout the SDK.
 */

/**
 * @typedef Everlive.ResultTypes.authenticationStatusResult
 * @description An object containing information about the current authentication status.
 * @property {Everlive.AuthStatus} result.status The current authentication status.
 * @property {Everlive.User} [result.user] When the SDK is authenticated, the user is also returned.
 */

/**
 * @typedef Users.ResultTypes
 * @description Defines the result types that can be returned by users functions.
 */

/**
 * @typedef Users.ResultTypes.currentUserResult
 * @description An object containing information about the current user.
 * @property {Date} CreatedAt
 * @property {GUID} CreatedBy
 * @property {GUID} Id
 * @property {String} IdentityProvider
 * @property {Boolean} IsVerified
 * @property {Object} Meta
 * @property {Date} ModifiedAt
 * @property {Date} ModifiedBy
 * @property {GUID} Owner
 * @property {GUID} Role
 * @property {String} Username
 */
