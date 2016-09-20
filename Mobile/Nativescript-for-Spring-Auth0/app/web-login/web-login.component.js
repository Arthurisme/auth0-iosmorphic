"use strict";
var core_1 = require("@angular/core");
var appSettings = require("application-settings");
// import * as Auth0Lock from "auth0-lock";
var Auth0Lock = require("auth0-lock");
// import { tokenNotExpired } from 'angular2-jwt';
// var Auth0Lock: any;
var WebLoginComponent = (function () {
    function WebLoginComponent() {
        var _this = this;
        this.firstWebViewSRC = "~/web-login/test.html";
        // Configure Auth0
        this.lock = new Auth0Lock('WIcfe2CWGUmcmJwYEfCk763nXyGLOFM6', 'arthurisme.auth0.com', {
            auth: {
                // redirect: false,
                params: {
                    scope: 'openid email roles user_metadata app_metadata picture offline_access',
                }
            }
        });
        // Set userProfile attribute if already saved profile
        this.userProfile = JSON.parse(appSettings.getString('profile'));
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", function (authResult) {
            console.log('authResult storged local by auth.service: \n', authResult);
            localStorage.setItem('id_token', authResult.idToken);
            console.log('id_token storged local by auth.service: \n', localStorage.getItem("id_token"));
            //binding user to spring boot:
            // this.userService.bindingUserToSpring().subscribe();
            // Fetch profile information
            _this.lock.getProfile(authResult.idToken, function (error, profile) {
                if (error) {
                    // Handle error
                    alert(error);
                    return;
                }
                profile.user_metadata = profile.user_metadata || {};
                appSettings.setString('profile', JSON.stringify(profile));
                _this.userProfile = profile;
                console.log('profile from login: \n', _this.userProfile);
                appSettings.setString("currentUserName", (profile.email));
                console.log('currentUserName from profile from login: \n', appSettings.getString("currentUserName"));
            });
        });
    }
    WebLoginComponent.prototype.login = function () {
        // Call the show method to display the widget.
        this.lock.show();
    };
    ;
    // public authenticated() {
    //     // Check if there's an unexpired JWT
    //     // It searches for an item in localStorage with key == 'id_token'
    //     return tokenNotExpired();
    // };
    WebLoginComponent.prototype.logout = function () {
        // Remove token from localStorage
        appSettings.remove('id_token');
        appSettings.remove('profile');
        this.userProfile = undefined;
    };
    ;
    WebLoginComponent = __decorate([
        core_1.Component({
            selector: "my-web-login",
            templateUrl: "web-login/web-login.component.html",
            styleUrls: ["web-login/web-login-common.css", "web-login/web-login.component.css"],
        }), 
        __metadata('design:paramtypes', [])
    ], WebLoginComponent);
    return WebLoginComponent;
}());
exports.WebLoginComponent = WebLoginComponent;
//# sourceMappingURL=web-login.component.js.map