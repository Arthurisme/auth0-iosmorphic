import platform from 'common/platform';
import rsvp from 'rsvp';
import {EverliveError} from 'EverliveError';
import _ from 'underscore';

const utils = {};

utils.guardUnset = function guardUnset(value, name, message) {
    if (!message) {
        message = 'The ' + name + ' is required';
    }
    if (typeof value === 'undefined' || value === null) {
        throw new EverliveError(message);
    }
};

utils.buildPromise = function buildPromise(operation, success, error) {
    var callbacks = utils.getCallbacks(success, error);
    operation(callbacks.success, callbacks.error);
    return callbacks.promise;
};

utils.getCallbacks = function (success, error) {
    var promise;
    var createPromise = function () {
        return new rsvp.Promise(function (resolve, reject) {
            success = function (data) {
                resolve(data);
            };
            error = function (error) {
                reject(error);
            };
        });
    };

    if (platform.isNodejs) {
        // node js style continuation
        if (typeof success === 'function' && typeof error !== 'function') {
            var callback = success;
            success = function (data, response) {
                callback(null, data, response);
            };
            error = function (error) {
                callback(error);
            };
        } else if (typeof success !== 'function' && typeof error !== 'function') {
            promise = createPromise();
        }
    } else {
        if (typeof success !== 'function' && typeof error !== 'function') {
            promise = createPromise();
        }
    }

    return {promise: promise, success: success, error: error};
};

utils.parseUtilities = {
    getReviver: function (parseOnlyCompleteDateTimeString) {
        var dateParser;
        if (parseOnlyCompleteDateTimeString) {
            dateParser = utils.parseUtilities.parseIsoDateString;
        } else {
            dateParser = utils.parseUtilities.parseOnlyCompleteDateTimeString;
        }

        return function (key, value) {
            if (typeof value === 'string') {
                var date = dateParser(value);
                if (date) {
                    value = date;
                }
            }

            return value;
        };
    },

    parseIsoDateString: function (string) {
        var match;
        if (match = string.match(/^(\d{4})(-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|((\+|-)(\d{2}):(\d{2}))))?))$/)) {
            // DateTime
            var secondParts = match[12];
            if (secondParts) {
                if (secondParts.length > 3) {
                    secondParts = Math.round(Number(secondParts.substr(0, 3) + '.' + secondParts.substr(3)));
                }
                else if (secondParts.length < 3) {
                    // if the secondParts are one or two characters then two or one zeros should be appended
                    // in order to have the correct number for milliseconds ('.67' means 670ms not 67ms)
                    secondParts += secondParts.length === 2 ? '0' : '00';
                }
            }
            var date = new Date(
                Date.UTC(
                    Number(match[1]), // year
                    (Number(match[3]) - 1) || 0, // month
                    Number(match[5]) || 0, // day
                    Number(match[7]) || 0, // hour
                    Number(match[8]) || 0, // minute
                    Number(match[10]) || 0, // second
                    Number(secondParts) || 0
                )
            );

            if (match[13] && match[13] !== "Z") {
                var h = Number(match[16]) || 0,
                    m = Number(match[17]) || 0;

                h *= 3600000;
                m *= 60000;

                var offset = h + m;
                if (match[15] === "+")
                    offset = -offset;

                date = new Date(date.valueOf() + offset);
            }

            return date;
        } else {
            return null;
        }
    },

    parseOnlyCompleteDateTimeString: function (string) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(string)) {
            // Date
            return null;
        }

        if (/^(\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|((\+|-)(\d{2}):(\d{2})))?$/.test(string)) {
            // Time
            return null;
        }

        return utils.parseUtilities.parseIsoDateString(string);
    },

    traverse: function (obj, func) {
        var key, value, newValue;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                newValue = func(key, value);
                obj[key] = newValue;
                if (value === newValue && typeof value === 'object') {
                    utils.parseUtilities.traverse(value, func);
                }
            }
        }
        return obj;
    },

    traverseAndRevive: function (data, reviver) {
        if (!reviver) {
            reviver = utils.parseUtilities.getReviver();
        }

        return utils.parseUtilities.traverse(data, reviver);
    },

    parseError: function (reviver, error) {
        if (typeof error === 'string' && error.length > 0) {
            try {
                error = JSON.parse(error);
                return {message: error.message, code: error.errorCode};
            } catch (e) {
                return error;
            }
        } else {
            return error;
        }
    },

    _parseInternal: function (reviver, data) {
        if (typeof data === 'string' && data.length > 0) {
            data = JSON.parse(data, reviver);
        } else if (typeof data === 'object') {
            utils.parseUtilities.traverseAndRevive(data, reviver);
        }

        return data;
    },

    _transformResult: function (data, additionalProperties) {
        if (data) {
            const result = _.extend({}, additionalProperties);
            result.result = data.Result === undefined ? data.result : data.Result;
            result.count = data.Count === undefined ? data.count : data.Count;
            return result;
        } else {
            return data;
        }
    },

    parseResult: function (reviver, data) {
        data = utils.parseUtilities._parseInternal.apply(null, arguments);
        return utils.parseUtilities._transformResult(data, {count: data.Count});
    },

    parseSingleResult: function (reviver, data) {
        data = utils.parseUtilities._parseInternal.apply(null, arguments);
        return utils.parseUtilities._transformResult(data);
    },

    parseUpdateResult: function (reviver, data) {
        data = utils.parseUtilities._parseInternal.apply(null, arguments);
        return utils.parseUtilities._transformResult(data, {ModifiedAt: data.ModifiedAt});
    },

    parseJSON: function (json) {
        return JSON.parse(json, utils.parseUtilities.getReviver());
    },

    parseXhrResponse: function (xhrRequest) {
        var type = xhrRequest.getResponseHeader('content-type');
        var isJson = type && type.toLowerCase().indexOf('json') > -1;
        var response = xhrRequest.responseText || xhrRequest.statusText;

        return isJson ? utils.parseUtilities.parseJSON(response) : response;
    },
    parseXhrError: function (reviver, xhrRequest) {
        if (xhrRequest instanceof Error) {
            return xhrRequest;
        }

        var message = xhrRequest.responseText || xhrRequest.statusText || xhrRequest;
        return utils.parseUtilities.parseError(reviver, message);
    },

    parseErrorOrResponse: function (error) {
        if (error instanceof XMLHttpRequest) {
            const parsedError = utils.parseUtilities.parseXhrResponse(error);
            //seems that parseXhrResponse is inconsistent
            return {
                code: parsedError.code || parsedError.errorCode,
                message: parsedError.message
            };
        }

        return utils.parseUtilities.parseError(null, error);
    }
};

utils.isDate = function (date) {
    return date && (
            date instanceof Date || !_.isNaN(Date.parse(date))
        );
};

utils.cloneDate = function (date) {
    return new Date(date);
};

// http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
utils.isGuid = function (str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

utils.successfulPromise = function (data) {
    return new rsvp.Promise(function (resolve) {
        resolve(data);
    });
};

utils.rejectedPromise = function (err) {
    return new rsvp.Promise(function (resolve, reject) {
        reject(err);
    });
};

utils.uuid = function () {
    //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
};

module.exports = utils;