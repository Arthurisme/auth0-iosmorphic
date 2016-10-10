import platform from 'everlive.platform';
import _ from 'underscore';

'use strict';

if (platform.isNativeScript) {
	var NativeScriptCurrentDevice = require('push/NativeScriptCurrentDevice');
    module.exports = NativeScriptCurrentDevice;
} else if (platform.isCordova || platform.isDesktop) {
	var CordovaCurrentDevice = require('push/CordovaCurrentDevice');
    module.exports = CordovaCurrentDevice;
} else {
    module.exports = _.noop;
}