import _ from 'underscore';
import platform from 'everlive.platform';
import path from 'path';
import constants from 'constants';
import commonUtils from 'common/utils';

const utils = _.deepExtend({}, commonUtils);

//brings down all keys to the same level (lowerCase)
utils.normalizeKeys = function normalizeKeys(obj) {
    var normalizedKeys = {};

    _.each(obj, function (val, key) {
        var lowerKey = key.toLowerCase();

        if (!normalizedKeys.hasOwnProperty(lowerKey)) {
            normalizedKeys[lowerKey] = val;
        }
    });

    return normalizedKeys;
};

utils.buildAuthHeader = function buildAuthHeader(setup, options) {
    var authHeaderValue = null;
    if (options && options.authHeaders === false) {
        return authHeaderValue;
    }
    if (setup.token) {
        authHeaderValue = (setup.tokenType || 'bearer') + ' ' + setup.token;
    }
    else if (setup.masterKey) {
        authHeaderValue = 'masterkey ' + setup.masterKey;
    }
    if (authHeaderValue) {
        return {authorization: authHeaderValue};
    } else {
        return null;
    }
};

utils.DeviceRegistrationResult = function DeviceRegistrationResult(token) {
    this.token = token;
};

utils.buildUrl = function (setup) {
    var url = '';
    if (typeof setup.scheme === 'string') {
        url += setup.scheme + ':';
    }
    url += setup.url;
    if (setup.appId) {
        url += setup.appId + '/';
    }
    return url;
};

utils.getDbOperators = function (expression, shallow) {
    var dbOperators = [];

    if (typeof expression === 'string' || typeof expression === 'number') {
        return dbOperators;
    }

    var modifierKeys = Object.keys(expression || {});
    _.each(modifierKeys, function (key) {
        if (key.indexOf('$') === 0) {
            dbOperators.push(key);
        } else if (typeof expression[key] === 'object' && !shallow) {
            dbOperators = dbOperators.concat(utils.getDbOperators(expression[key]));
        }
    });

    return dbOperators;
};

utils.disableRequestCache = function (url, method) {
    if (method === 'GET') {
        var timestamp = (new Date()).getTime();
        var separator = url.indexOf('?') > -1 ? '&' : '?';
        url += separator + '_el=' + timestamp;
    }

    return url;
};

const unsupportedDbOperators = [
    '$geoWithin',
    '$geoIntersects',
    '$near',
    '$within',
    '$nearSphere'
];

utils.getUnsupportedOperators = function (filter) {
    var dbOperators = utils.getDbOperators(filter);
    return _.intersection(dbOperators, unsupportedDbOperators);
};

utils.isQuerySupportedOffline = function (query) {
    var queryParams = query.getQueryParameters();
    var hasExpandExpression = !_.isEmptyObject(queryParams.expand);
    var unsupportedOperators = utils.getUnsupportedOperators(queryParams.filter);
    var hasUnsupportedOperators = unsupportedOperators.length !== 0;
    var isUnsupportedInOffline = hasExpandExpression || hasUnsupportedOperators;
    return !isUnsupportedInOffline;
};

// http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript/16245768#16245768
utils.b64toBlob = function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
};

// http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
utils.arrayBufferToBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
};

utils.transformPlatformPath = function transformPlatformPath(platformPath) {
    if (!platformPath) {
        return '';
    }

    if (platform.isWindowsPhone) {
        if (platformPath.charAt(0) === '/' && platformPath.charAt(1) !== '/') {
            platformPath = '/' + platformPath;
        }
    } else { //TODO: probably desktop too
        if (platformPath.indexOf('file:/') !== -1 && platformPath.indexOf('file:///') === -1) {
            platformPath = platformPath.replace('file:/', 'file:///');
        }
    }

    return platformPath;
};

utils._stringCompare = function (string, check) {
    return string.toLowerCase() === check;
};

utils.isContentType = {
    files: function (collectionName) {
        return utils._stringCompare(collectionName, 'files');
    },
    users: function (collectionName) {
        return utils._stringCompare(collectionName, 'users');
    },
    pushNotifications: function (collectionName) {
        return utils._stringCompare(collectionName, constants.Push.NotificationsType.toLowerCase());
    },
    pushDevices: function (collectionName) {
        return utils._stringCompare(collectionName, constants.Push.DevicesType.toLowerCase());
    }
};

utils.isElement = {
    _isElement: function (el, check) {
        var tag = el;

        if (typeof tag !== 'string') {
            if (el instanceof HTMLElement) {
                tag = el.tagName;
            }
        }

        return utils._stringCompare(tag, check);
    },
    image: function (el) {
        return utils.isElement._isElement(el, 'img');
    },
    anchor: function (el) {
        return utils.isElement._isElement(el, 'a');
    }
};

utils.joinPath = function joinPath() {
    var args = [].slice.apply(arguments).map(function (arg) {
        return arg || '';
    });

    var joinedPath = path.join.apply(path, args);
    return utils.transformPlatformPath(joinedPath);
};

utils.getId = function (obj) {
    return obj.Id || obj._id || obj.id;
};

utils._inAppBuilderSimulator = function () {
    return typeof window !== 'undefined' && window.navigator && window.navigator.simulator;
};

utils.isValidId = function (input) {
    var isValidString = typeof input === 'string' && input !== '';
    var isValidNumber = typeof input === 'number' && !_.isNaN(input);

    return isValidString || isValidNumber;
};

utils.modelHasValidId = function (model) {
    var idToValidate = (typeof model === 'object' && model !== null) ? model.Id : model;
    return utils.isValidId(idToValidate);
};

utils.callbackAndPromiseErrorResponse = function (err, errorHandler) {
    errorHandler = errorHandler || _.noop;
    errorHandler(err);
    return utils.rejectedPromise(err);
};

utils.toQueryString = function (obj) {
    var queryString = '',
        encode = encodeURIComponent,
        append = function (k, v) {
            queryString += encode(k) + '=' + encode(v) + '&'
        };

    if (_.isArray(obj)) {
        for (var i = 0; obj && i < obj.length; i++) {
            append(obj[i].name, obj[i].value)
        }
    } else {
        for (var propName in obj) {
            if (!obj.hasOwnProperty(propName)) {
                continue;
            }

            var value = obj[propName];

            if (_.isArray(value)) {
                for (i = 0; i < value.length; i++) {
                    append(propName, value[i])
                }
            } else {
                append(propName, obj[propName])
            }
        }
    }

    // spaces should be + according to spec
    return queryString.replace(/&$/, '').replace(/%20/g, '+');
};

utils.lazyRequire = function (_dynamic_module_, exportName) {
    exportName = exportName || _dynamic_module_;
    var obj = {};

    Object.defineProperty(obj, exportName, {
        get: function () {
            return require(_dynamic_module_);
        }
    });

    return obj;
};

module.exports = utils;
