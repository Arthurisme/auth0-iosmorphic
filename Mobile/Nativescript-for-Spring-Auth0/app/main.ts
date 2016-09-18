// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
// import { NgModule } from "@angular/core";
// import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

// @NgModule({
//     declarations: [AppComponent],
//     bootstrap: [AppComponent],
//     imports: [NativeScriptModule],
// })
// class AppComponentModule {}






//Auth0 plugin:
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
declare var android: any;
declare var UIResponder: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;
declare var UIApplicationDelegate: any;
declare var  appDelegate : any;
declare var   __extends: any;

if (application.ios) {
    var __extends = this.__extends || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() { this.constructor = d; }
            __.prototype = b.prototype;
            d.prototype = new __();
        };

    var appDelegate: any = (function (_super) {
        __extends(appDelegate, _super);
        function appDelegate() {
            _super.apply(this, arguments);
        }

        appDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
            auth0.initalize();
            return true;
        };

        (appDelegate as any).ObjCProtocols = [UIApplicationDelegate];
        return appDelegate;
    })(UIResponder);
    application.ios.delegate = appDelegate;
}else{
    //Android
    auth0.initalize();
}
//End Auth0 plugin



platformNativeScriptDynamic().bootstrapModule(AppModule);