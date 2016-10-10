var utils = require('utils');

function OrderProperty(propertyPath, isDesc) {
    if (!utils.isString(propertyPath))
        throw new Error('Property name is not a valid string');

    propertyPath = propertyPath.trim();

    var parts = propertyPath.split(' ');
    // parts[0] is the propertyPath; [1] would be whether descending or not.
    if (parts.length > 1 && isDesc !== true && isDesc !== false) {
        isDesc = parts[1].toLowerCase() == 'desc';
        if (!isDesc) {
            // isDesc is false but check to make sure its intended.
            var isAsc = parts[1].toLowerCase() == 'asc';
            if (!isAsc) {
                throw new Error("the second word in the propertyPath must begin with 'desc' or 'asc'");
            }
        }
    }

    this._propertyPath = parts[0];
    this._isDesc = isDesc;
}

OrderProperty.prototype = {
    getPropertyPath: function () {
        return this._propertyPath;
    },

    getDirection: function () {
        return this._isDesc;
    },

    getValue: function () {
        var direction = (this._isDesc) ? 'desc' : 'asc';
        return this._propertyPath + ' ' + direction;
    }
};

module.exports = OrderProperty;