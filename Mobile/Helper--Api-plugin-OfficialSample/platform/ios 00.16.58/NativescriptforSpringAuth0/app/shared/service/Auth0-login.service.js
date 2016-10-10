"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var _1 = require("../");
var auth0 = require("nativescript-auth0");
var appSettings = require("application-settings");
var application = require("application");
var config_1 = require("../../config/config");
var tokenKey = "auth0Token";
var Auth0LoginService = (function () {
    function Auth0LoginService(router) {
        this.router = router;
        this.config = new config_1.Config();
        if (this.isLoggedIn) {
            //Read storages to memory variables, both in isLogin, constructor,login:
            this.readStorageToVariables();
        }
    }
    Object.defineProperty(Auth0LoginService.prototype, "isLoggedIn", {
        get: function () {
            // Check to see if the user is logged in
            if (!appSettings.hasKey(this.config.auth0TokenName)) {
                console.log("no token stored.");
                //if no token stored: go to login:
                // this.doLogin();
                return false;
            }
            else {
                console.log("has token stored");
                //Test if token and profile is saved:
                var tokenData = this.auth0TokenFromLocalStorage;
                console.log("Token stored @isLoggedIn is:");
                console.log(tokenData);
                var profileData = JSON.parse(this.profileFromLocalStorage);
                console.log("User profile stored @isLoggedIn is:");
                console.log(profileData);
                console.log("User profile name stored @isLoggedIn is:");
                console.log(profileData.name);
                //Check if it's expired : go to login:
                // if(auth0.isTokenExpired(tokenData.token.idToken)){
                if (auth0.isTokenExpired(this.token)) {
                    //Make them log in again
                    console.log("token expired, login again.");
                    // this.doLogin();
                    return false;
                }
                else {
                    //All good, navigate to your start page
                    console.log("has token stored, go to next page");
                    //Read storages to memory variables, both in isLogin, constructor,login:
                    this.readStorageToVariables();
                    // this.gotonextpage();
                    return true;
                }
            }
            // return !!getString(tokenKey);
        },
        enumerable: true,
        configurable: true
    });
    Auth0LoginService.prototype.readStorageToVariables = function () {
        //Read storages to memory variables
        this.profileJson = JSON.parse(this.profileFromLocalStorage);
        this.idToken = this.idTokenFromLocalStorage;
    };
    Object.defineProperty(Auth0LoginService.prototype, "token", {
        get: function () {
            return appSettings.getString(this.config.auth0TokenName);
        },
        set: function (theToken) {
            appSettings.setString(this.config.auth0TokenName, theToken);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth0LoginService.prototype, "auth0TokenFromLocalStorage", {
        get: function () {
            return appSettings.getString(this.config.auth0TokenName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth0LoginService.prototype, "idTokenFromLocalStorage", {
        get: function () {
            return JSON.parse(appSettings.getString(this.config.auth0TokenName)).idToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth0LoginService.prototype, "profileFromLocalStorage", {
        get: function () {
            return appSettings.getString(this.config.auth0ProfileName);
        },
        enumerable: true,
        configurable: true
    });
    //This is for standard login, which lead a navigater to "/ping"
    Auth0LoginService.prototype.login = function () {
        var _this = this;
        var afterLoginPageUri = "/ping";
        if (this.isLoggedIn) {
            this.router.navigate([afterLoginPageUri]);
        }
        else {
            console.log("Starting processing of login...");
            auth0.show().then(function (args) {
                console.log(args.profile);
                console.log(args.token);
                // appSettings.setString("auth0Token", JSON.stringify(args));
                //Read storages to memory variables, both in isLogin, constructor,login:
                _this.readStorageToVariables();
                var afterLoginPageUri = "/ping";
                _this.router.navigate([afterLoginPageUri]);
                console.log("login ok point 1 !");
            }, function (error) {
                _1.alert(error);
            });
            console.log("login ok point a2 !");
        }
    };
    //custom login, which lead a navigater to afterLoginPageUri ---format as "/ping"
    Auth0LoginService.prototype.loginAndTo = function (afterLoginPageUri) {
        var _this = this;
        if (this.isLoggedIn) {
            this.router.navigate([afterLoginPageUri]);
        }
        else {
            console.log("Starting processing of login...");
            auth0.show({
                // Params: {
                //   scope: 'openid email roles user_metadata app_metadata picture offline_access',
                //   // device: 'Mobile device'
                // },
                // auth: {
                //   // redirect: false,
                //   params: {
                //     scope: 'openid email roles user_metadata app_metadata picture offline_access',
                //   }
                // },
                closable: true,
                autoclose: true,
                rememberLastLogin: true,
                languageDictionary: {
                    emailInputPlaceholder: "something@youremail.com",
                    title: "Log me in"
                },
            })
                .then(function (args) {
                console.log(args.profile);
                console.log(args.token);
                //This will done by plugin: not here.
                // appSettings.setString("auth0Token", JSON.stringify(args));
                // let afterLoginPageUri = "/ping";
                _this.router.navigate([afterLoginPageUri]);
                console.log("login ok point 1 !");
            }, function (error) {
                _1.alert(error);
            });
            console.log("login ok point b2 !");
        }
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
        __metadata('design:paramtypes', [router_1.Router])
    ], Auth0LoginService);
    return Auth0LoginService;
}());
exports.Auth0LoginService = Auth0LoginService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aDAtbG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkF1dGgwLWxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUd6Qyx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUd2QyxpQkFBZ0QsS0FBSyxDQUFDLENBQUE7QUFDdEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsSUFBWSxXQUFXLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUVwRCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFJekMsdUJBQXFCLHFCQUFxQixDQUFDLENBQUE7QUFHM0MsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBRzlCO0lBT0ksMkJBQW9CLE1BQWE7UUFBYixXQUFNLEdBQU4sTUFBTSxDQUFPO1FBTGpDLFdBQU0sR0FBVSxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBU3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLHdFQUF3RTtZQUN4RSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNsQyxDQUFDO0lBR0wsQ0FBQztJQUdELHNCQUFJLHlDQUFVO2FBQWQ7WUFFSSx3Q0FBd0M7WUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBRWhDLGtDQUFrQztnQkFDbEMsa0JBQWtCO2dCQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDO1lBRWpCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixD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