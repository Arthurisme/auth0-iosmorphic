import platform from 'common/platform';

module.exports = (function () {
    const isNativeScript = platform.isNativeScript;
    const isNodejs = platform.isNodejs;

    let reqwest;
    if (!isNodejs && !isNativeScript) {
        reqwest = require('reqwest');
    } else if (isNativeScript) {
        reqwest = require('./reqwest.nativescript');
    } else if (isNodejs) {
        reqwest = require('./reqwest.nodejs');
    }

    return reqwest;
}());