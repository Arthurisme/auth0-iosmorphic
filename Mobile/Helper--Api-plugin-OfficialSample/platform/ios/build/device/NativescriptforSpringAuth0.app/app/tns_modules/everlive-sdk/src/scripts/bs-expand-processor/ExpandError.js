'use strict';
function ExpandError(message) {
    this.name = 'ExpandError';
    this.message = message;
    this.stack = (new Error()).stack;
}
ExpandError.prototype = new Error;
module.exports = ExpandError;