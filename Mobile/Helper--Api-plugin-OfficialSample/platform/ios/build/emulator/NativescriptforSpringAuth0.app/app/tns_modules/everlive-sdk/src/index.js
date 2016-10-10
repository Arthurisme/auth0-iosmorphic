//build-specific sdk, e.g. if we build with --target sitefinity this will require the index.js file in the sitefinity folder
//and index.js in the platform folder if the --target is platform
import 'common/index'; //initialize common sdk
import Sdk from 'index'; //initialize platform specific sdk

module.exports = Sdk;
