"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var shared_1 = require("../shared");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var Auth0_login_service_1 = require("../shared/Auth0-login.service");
var Auth0testpageComponent = (function () {
    function Auth0testpageComponent(router, auth0LoginService) {
        this.router = router;
        this.auth0LoginService = auth0LoginService;
        // Check to see if the user is logged in
        if (!appSettings.hasKey("auth0Token")) {
            console.log("no token stored.");
            // this.router.navigate(["/ping"]);
            this.doLogin();
        }
        else {
            console.log("has token stored");
            // this.gotonextpage();
            //Deserialzise the saved user
            var tokenData = JSON.parse(appSettings.getString("auth0Token"));
            console.log("token begain: " + appSettings.getString("auth0Token") + " token end.");
            //Check if it's expired
            // if(auth0.isTokenExpired(tokenData.token.idToken)){
            if (auth0.isTokenExpired(tokenData.idToken)) {
                //Make them log in again
                console.log("token expired, login again.");
                this.doLogin();
            }
            else {
                //All good, navigate to your start page
                console.log("has token stored, go to next page");
                this.gotonextpage();
            }
        }
        // // Check to see if the user is logged in
        // if(!appSettings.hasKey("auth0Token")){
        //     console.log("no token stored.");
        //     // this.router.navigate(["/ping"]);
        //
        //     this.doLogin();
        //
        // }else{
        //     console.log("has token stored");
        //     // this.gotonextpage();
        //
        //
        //     //Deserialzise the saved user
        //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        //     console.log("token begain: "+ appSettings.getString("auth0Token")+ " token end.");
        //
        //
        //     //Check if it's expired
        //     // if(auth0.isTokenExpired(tokenData.token.idToken)){
        //         if(auth0.isTokenExpired(tokenData.idToken)){
        //         //Make them log in again
        //         console.log("token expired, login again.");
        //
        //         this.doLogin();
        //     }else{
        //         //All good, navigate to your start page
        //         console.log("has token stored, go to next page");
        //
        //         this.gotonextpage();
        //     }
        // }
    }
    Auth0testpageComponent.prototype.doLogin = function () {
        var _this = this;
        console.log("doLoging start...");
        if (this.auth0LoginService.isLoggedIn) {
            this.router.navigate(["/ping"]);
        }
        else {
            auth0.show().then(function (args) {
                console.log(args.profile);
                console.log(args.token);
                // appSettings.setString("auth0Token", JSON.stringify(args));
                _this.router.navigate(["/ping"]);
                console.log("login ok 1 !");
                // this.loginService.logoff();
                // this.router.navigate(["/groceries"]);
                // this.router.navigate(["/"]);
                // this.gotonextpage();
            }, function (error) {
                shared_1.alert(error);
            });
        }
        console.log("login ok 2!");
        // this.gotonextpage();
    };
    Auth0testpageComponent.prototype.doLogout = function () {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");
        this.router.navigate(["/auth0testpage"]);
    };
    Auth0testpageComponent.prototype.gotonextpage = function () {
        this.router.navigate(["/ping"]);
        // this.router.navigate(["/groceries"]);
        // this.router.navigate(["/"]);
    };
    Auth0testpageComponent.prototype.goToHome = function () {
        this.router.navigate(["/"]);
    };
    Auth0testpageComponent.prototype.test1 = function () {
    };
    Auth0testpageComponent.prototype.test2 = function () {
        this.test1();
        this.gotonextpage();
    };
    Auth0testpageComponent = __decorate([
        core_1.Component({
            selector: "gr-auth0testpage",
            templateUrl: "auth0testpage/auth0testpage.component.html",
            styleUrls: ["auth0testpage/auth0testpage-common.css", "auth0testpage/auth0testpage.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, Auth0_login_service_1.Auth0LoginService])
    ], Auth0testpageComponent);
    return Auth0testpageComponent;
}());
exports.Auth0testpageComponent = Auth0testpageComponent;
//# sourceMappingURL=auth0testpage.component.js.map