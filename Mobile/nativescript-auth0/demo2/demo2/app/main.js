"use strict";
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var auth0 = require("nativescript-auth0");
var application = require("application");
if (application.ios) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var appDelegate = (function (_super) {
        __extends(appDelegate, _super);
        function appDelegate() {
            _super.apply(this, arguments);
        }
        appDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
            auth0.initalize();
            return true;
        };
        appDelegate.ObjCProtocols = [UIApplicationDelegate];
        return appDelegate;
    })(UIResponder);
    application.ios.delegate = appDelegate;
}
else {
    //Android
    auth0.initalize();
}
application_1.nativeScriptBootstrap(app_component_1.AppComponent);
//# sourceMappingURL=main.js.map