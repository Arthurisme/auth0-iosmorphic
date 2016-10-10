import _ from 'underscore';
import commonUtils from 'common/utils';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match;
        });
    };
}

export const utils = _.deepExtend({}, commonUtils);

utils.inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};

utils.isString = function (obj) {
    return typeof (obj) === 'string' || obj instanceof String;
};

utils.isNumber = function (value) {
    return typeof value === 'number' && isFinite(value);
};

utils.isBoolean = function (value) {
    return typeof (value) === "boolean";
};

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number]!= 'undefined'
        ? args[number]
        : match;
    });
  };
}

utils.hex16 = function () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
};

utils.addTrailingSlash = function (url) {
    url = utils.removeSlashes(url);
    url += '/';
    return url;
};

utils.removeSlashes = function (url) {
    var ret = url;
    var fistChar = ret.substr(0, 1);
    if (fistChar == '/')
        ret = ret.substr(1);

    var lastChar = ret.substr(-1);
    if (lastChar == '/')
        ret = ret.substr(0, url.length - 1);

    return ret;
};

utils.clone = function (from, to, action) {

    if (!to)
        to = {};

    for (var property in from) {
        if (from[property] && from[property].constructor && from[property].constructor === Object && typeof from[property] == 'function') {
            to[property] = to[property]|| { };
            arguments.callee(to[property], from[property]);
        } else {
            to[property] = from[property];
        }

        if (typeof action === 'function')
            action(to);
    }

    return to;
};

utils._convertDateFieldToISOString = function (data) {
    /*
    TODOSDK: when write tests for this try to use 
    "Object.keys(obj).forEach(function(){})", 
    Phantomjs does not recognize "for..in" operator.
    */
    for (obj in data) {
        if (data[obj] instanceof Date) {
            data[obj] = data[obj].toISOString();
        }
    }
};

utils._convertToDateObject = function (data) {
    for (var obj in data) {
        if (data[obj] instanceof Array || data[obj] instanceof Object)
            this._convertToDateObject(data[obj]);
        else
            data[obj] = utils._tryFormatFieldToDate(data[obj]);
    }
};

utils._tryFormatFieldToDate = function (date) {
    if ((/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/).test(date)) {
        date = new Date(date).toString();
    }

    return date;
};

module.exports = utils;
