import _ from 'underscore';
import commonErrors from 'common/errors';

let EverliveErrors = {
    itemNotFound: {
        code: 801,
        message: 'Item not found.'
    },
    syncConflict: {
        code: 10001,
        message: 'A conflict occurred while syncing data.'
    },
    syncError: {
        code: 10002,
        message: 'Synchronization failed for item.'
    },
    syncInProgress: {
        code: 10003,
        message: 'Cannot perform operation while synchronization is in progress.'
    },
    syncCancelledByUser: {
        code: 10004,
        message: 'Synchronization cancelled by user.'
    },
    syncErrorUnknown: {
        code: 10005,
        message: 'An unknown error occurred while synchronizing. Please make sure there is internet connectivity.'
    },
    operationNotSupportedOffline: {
        code: 20000 // the error message is created dynamically based on the query filter for offline storage
    },
    invalidId: {
        code: 20001,
        message: 'Invalid or missing Id in model.'
    },
    bodyWithGetRequestNotSupported: {
        code: 601,
        message: 'Sending a request body is not supported for "GET" requests.'
    },
    invalidOrMissingFunctionName: {
        code: 601,
        message: 'Invalid or missing cloud function name.'
    },
    invalidOrMissingProcedureName: {
        code: 601,
        message: 'Invalid or missing procedure name.'
    },
    generalDatabaseError: {
        code: 107,
        message: 'General database error.'
    },
    invalidToken: {
        code: 301,
        message: 'Invalid access token.'
    },
    expiredToken: {
        code: 302,
        message: 'Expired access token.'
    },
    invalidExpandExpression: {
        code: 618,
        message: 'Invalid expand expression.'
    },
    invalidRequest: {
        code: 601,
        message: 'Invalid request.'
    },
    queryCancelled: {
        code: 700,
        message: 'Query cancelled.'
    },
    missingContentType: {
        code: 701,
        message: 'ContentType not specified.'
    },
    missingOrInvalidFileContent: {
        code: 702,
        message: 'Missing or invalid file content.'
    },
    customFileSyncNotSupported: {
        code: 703,
        message: 'Custom ConflictResolution for files is not allowed.'
    },
    cannotDownloadOffline: {
        code: 704,
        message: 'Cannot download a file while offline.'
    },
    cannotForceCacheWhenDisabled: {
        code: 705,
        message: 'Cannot use forceCache while the caching is disabled.'
    },
    filesNotSupportedInBrowser: {
        code: 706,
        message: 'Create and Update operations are not supported for Files in browsers while in offline mode.'
    },
    pushNotSupportedOffline: {
        code: 707,
        message: 'Push is not supported in offline mode.'
    },
    noOfflineSupport: {
        code: 708,
        message: 'You have instantiated the SDK without support for offline storage.'
    },
	cacheDisabled: {
        code: 709 // the error message is created dynamically based on the cache operation
    },
    singleValueExpected: {
        code: 710
    }
};

EverliveErrors = _.deepExtend(EverliveErrors, commonErrors);

const EverliveErrorHelper = {
    buildCacheDisabledErrorMessage: function (cacheOperation) {
        const errorMessage = 'Cannot use ' + cacheOperation + ' while the caching is disabled.';
        return errorMessage;
    },
    buildSingleValueExpectedErrorMessage: function (operation) {
        const errorMessage = 'A single value is expected in ' + operation + ' query modifier.';
        return errorMessage;
    }
};

var EverliveError = (function () {
    function EverliveError(message, code) {
        var tmpError = Error.apply(this);

        if (typeof message === 'object') {
            var err = message;
            message = err.message;
            code = err.code;
        }

        tmpError.message = message;
        tmpError.code = code || 0;
        tmpError.name = this.name = 'EverliveError';

        this.message = tmpError.message;
        this.code = code;

        Object.defineProperty(this, 'stack', {
            get: function () {
                return tmpError.stack
            }
        });

        return this;
    }

    EverliveError.prototype = Object.create(Error.prototype);
    EverliveError.prototype.toJSON = function () {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            stack: this.stack
        };
    };

    return EverliveError;
}());

var DeviceRegistrationError = (function () {
    var DeviceRegistrationError = function (errorType, message, additionalInformation) {
        var errorCode = additionalInformation ? additionalInformation.code : undefined;
        EverliveError.call(this, message, errorCode);
        this.errorType = errorType;
        this.message = message;
        if (additionalInformation !== undefined) {
            this.additionalInformation = additionalInformation;
        }
    };

    DeviceRegistrationError.prototype = Object.create(EverliveError.prototype);

    DeviceRegistrationError.fromEverliveError = function (everliveError) {
        var deviceRegistrationError = new DeviceRegistrationError(DeviceRegistrationErrorTypes.EverliveError, everliveError.message, everliveError);
        return deviceRegistrationError;
    };

    DeviceRegistrationError.fromPluginError = function (errorObj) {
        var message = 'A plugin error occurred';
        if (errorObj) {
            if (typeof errorObj.error === 'string') {
                message = errorObj.error;
            } else if (typeof errorObj.message === 'string') {
                message = errorObj.message;
            }
        }

        var deviceRegistrationError = new DeviceRegistrationError(DeviceRegistrationErrorTypes.PluginError, message, errorObj);
        return deviceRegistrationError;
    };

    var DeviceRegistrationErrorTypes = {
        EverliveError: 1,
        PluginError: 2
    };

    return DeviceRegistrationError;
}());

module.exports = {
    EverliveError: EverliveError,
    EverliveErrorHelper: EverliveErrorHelper,
    EverliveErrors: EverliveErrors,
    DeviceRegistrationError: DeviceRegistrationError
};