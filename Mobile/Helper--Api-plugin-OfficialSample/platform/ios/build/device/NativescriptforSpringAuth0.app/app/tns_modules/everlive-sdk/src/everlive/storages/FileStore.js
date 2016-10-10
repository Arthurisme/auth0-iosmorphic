import platform from 'everlive.platform';
import WebFileStore from 'storages/WebFileStore';
import NativeScriptFileStore from 'storages/NativeScriptFileStore';
import _ from 'underscore';

if (platform.isNativeScript) {
    module.exports = NativeScriptFileStore;
} else if (platform.isCordova || platform.isDesktop) {
    module.exports = WebFileStore;
} else {
    module.exports = _.noop;
}