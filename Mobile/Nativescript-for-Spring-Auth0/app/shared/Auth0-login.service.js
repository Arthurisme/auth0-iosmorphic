"use strict";
var core_1 = require("@angular/core");
var backend_service_1 = require("./backend.service");
var router_1 = require("@angular/router");
var shared_1 = require("../shared");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var tokenKey = "auth0Token";
var Auth0LoginService = (function () {
    function Auth0LoginService(router, backend) {
        this.router = router;
        this.backend = backend;
        if (this.token) {
            this.backend.el.authentication.setAuthorization(this.token, "bearer");
        }
    }
    Object.defineProperty(Auth0LoginService.prototype, "isLoggedIn", {
        get: function () {
            // Check to see if the user is logged in
            if (!appSettings.hasKey(tokenKey)) {
                console.log("no token stored.");
                //if no token stored: go to login:
                // this.doLogin();
                return false;
            }
            else {
                console.log("has token stored");
                //Deserialzise the saved user
                var tokenData = JSON.parse(appSettings.getString(tokenKey));
                console.log("token begain: " + appSettings.getString(tokenKey) + " token end.");
                //Check if it's expired : go to login:
                // if(auth0.isTokenExpired(tokenData.token.idToken)){
                if (auth0.isTokenExpired(tokenData.idToken)) {
                    //Make them log in again
                    console.log("token expired, login again.");
                    // this.doLogin();
                    return false;
                }
                else {
                    //All good, navigate to your start page
                    console.log("has token stored, go to next page");
                    // this.gotonextpage();
                    return true;
                }
            }
            // return !!getString(tokenKey);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth0LoginService.prototype, "token", {
        get: function () {
            return appSettings.getString(tokenKey);
        },
        set: function (theToken) {
            appSettings.setString(tokenKey, theToken);
        },
        enumerable: true,
        configurable: true
    });
    Auth0LoginService.prototype.register = function (user) {
        return this.backend.el.Users.register(user.email, user.password)
            .catch(this.handleErrors);
    };
    //This is for standard login, which lead a navigater to "/ping"
    Auth0LoginService.prototype.login = function () {
        var _this = this;
        console.log("Starting processing of login...");
        auth0.show().then(function (args) {
            console.log(args.profile);
            console.log(args.token);
            // appSettings.setString("auth0Token", JSON.stringify(args));
            var afterLoginPageUri = "/ping";
            _this.router.navigate([afterLoginPageUri]);
            console.log("login ok point 1 !");
        }, function (error) {
            shared_1.alert(error);
        });
        console.log("login ok point 2 !");
        // this.gotonextpage();
    };
    //custom login, which lead a navigater to afterLoginPageUri ---format as "/ping"
    Auth0LoginService.prototype.loginAndTo = function (afterLoginPageUri) {
        var _this = this;
        console.log("Starting processing of login...");
        auth0.show().then(function (args) {
            console.log(args.profile);
            console.log(args.token);
            //This will done by plugin: not here.
            // appSettings.setString("auth0Token", JSON.stringify(args));
            // let afterLoginPageUri = "/ping";
            _this.router.navigate([afterLoginPageUri]);
            console.log("login ok point 1 !");
        }, function (error) {
            shared_1.alert(error);
        });
        console.log("login ok point 2 !");
        // this.gotonextpage();
    };
    //This is for standard login, which lead a navigater to   "/ping"
    Auth0LoginService.prototype.logoff = function () {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");
        var afterLogoffPageUri = "/ping";
        this.router.navigate([afterLogoffPageUri]);
    };
    //custom logoff, which lead a navigater to afterLoginPageUri ---format as "/ping"
    Auth0LoginService.prototype.logoffAndTo = function (afterLogoffPageUri) {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");
        // let afterLogoffPageUri = "/ping";
        this.router.navigate([afterLogoffPageUri]);
    };
    // resetPassword(email) {
    //
    // }
    Auth0LoginService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    Auth0LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router, backend_service_1.BackendService])
    ], Auth0LoginService);
    return Auth0LoginService;
}());
exports.Auth0LoginService = Auth0LoginService;
//# sourceMappingURL=Auth0-login.service.js.map