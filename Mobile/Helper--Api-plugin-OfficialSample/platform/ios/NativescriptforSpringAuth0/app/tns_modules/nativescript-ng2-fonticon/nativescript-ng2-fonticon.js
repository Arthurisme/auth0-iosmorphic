"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// for standard export at bottom
var fonticon_pipe_1 = require('./src/app/pipes/fonticon.pipe');
var fonticon_service_1 = require('./src/app/services/fonticon.service');
// for manual imports
__export(require('./src/app/pipes/fonticon.pipe'));
__export(require('./src/app/services/fonticon.service'));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    pipes: [fonticon_pipe_1.TNSFontIconPipe, fonticon_pipe_1.TNSFontIconPurePipe],
    providers: [fonticon_service_1.TNSFontIconService]
};
