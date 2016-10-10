"use strict";
// angular
var core_1 = require('@angular/core');
// nativescript
var file_system_1 = require('file-system');
// libs
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var TNSFontIconService = (function () {
    function TNSFontIconService(paths, debug) {
        this.css = {}; // font icon collections containing maps of classnames to unicode
        this._debug = false;
        this._paths = paths;
        this._debug = debug;
        this.filesLoaded = new BehaviorSubject_1.BehaviorSubject(null);
        this.loadCss();
    }
    TNSFontIconService.prototype.loadCss = function () {
        var _this = this;
        var cnt = 0;
        var fontIconCollections = Object.keys(this._paths);
        if (this._debug) {
            console.log("Collections to load: " + fontIconCollections);
        }
        var initCollection = function () {
            _this._currentName = fontIconCollections[cnt];
            _this.css[_this._currentName] = {};
        };
        var loadFiles = function () {
            initCollection();
            if (cnt === fontIconCollections.length) {
                _this.filesLoaded.next(_this.css);
            }
            else {
                _this.loadFile(_this._paths[_this._currentName]).then(function () {
                    cnt++;
                    loadFiles();
                });
            }
        };
        loadFiles();
    };
    TNSFontIconService.prototype.loadFile = function (path) {
        var _this = this;
        if (this._debug) {
            console.log("----------");
            console.log("Loading collection '" + this._currentName + "' from file: " + path);
        }
        var cssFile = file_system_1.knownFolders.currentApp().getFile(path);
        return new Promise(function (resolve, reject) {
            cssFile.readText().then(function (data) {
                _this.mapCss(data);
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    TNSFontIconService.prototype.mapCss = function (data) {
        var sets = data.split('}');
        var cleanValue = function (val) {
            var v = val.split('content:')[1].toLowerCase().replace(/\\f/, '\\uf').trim().replace(/\"/g, '').replace(/;/g, '');
            return v;
        };
        for (var _i = 0, sets_1 = sets; _i < sets_1.length; _i++) {
            var set = sets_1[_i];
            var pair = set.replace(/ /g, '').split(':before{');
            var keyGroups = pair[0];
            var keys = keyGroups.split(',');
            if (pair[1]) {
                var value = cleanValue(pair[1]);
                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                    var key = keys_1[_a];
                    key = key.trim().slice(1).split(':before')[0];
                    this.css[this._currentName][key] = String.fromCharCode(parseInt(value.substring(2), 16));
                    if (this._debug) {
                        console.log(key + ": " + value);
                    }
                }
            }
        }
    };
    TNSFontIconService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object, Boolean])
    ], TNSFontIconService);
    return TNSFontIconService;
}());
exports.TNSFontIconService = TNSFontIconService;
