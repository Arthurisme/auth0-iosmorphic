"use strict";
var platform_1 = require("nativescript-angular/platform");
var app_module_1 = require("./app.module");
require("nativescript-orientation");
//Auth0 plugin:
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
//End Auth0 plugin
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUFnRSwrQkFBK0IsQ0FBQyxDQUFBO0FBQ2hHLDJCQUEwQixjQUFjLENBQUMsQ0FBQTtBQUd6QyxPQUFPLENBQUUsMEJBQTBCLENBQUUsQ0FBQztBQUt0QyxlQUFlO0FBQ2YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBVXpDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN4QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQztJQUVOLElBQUksV0FBVyxHQUFRLENBQUMsVUFBVSxNQUFNO1FBQ3BDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0I7WUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsV0FBVyxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsR0FBRyxVQUFVLFdBQVcsRUFBRSxhQUFhO1lBQ2pHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVELFdBQW1CLENBQUMsYUFBYSxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hCLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztBQUMzQyxDQUFDO0FBQUEsSUFBSSxDQUFBLENBQUM7SUFDRixTQUFTO0lBQ1QsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFDRCxrQkFBa0I7QUFPbEIsc0NBQTJCLEVBQUUsQ0FBQyxlQUFlLENBQUMsc0JBQVMsQ0FBQyxDQUFDIn0=