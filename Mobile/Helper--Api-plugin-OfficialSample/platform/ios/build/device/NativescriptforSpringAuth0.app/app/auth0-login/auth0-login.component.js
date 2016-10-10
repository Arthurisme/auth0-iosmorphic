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
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var Auth0_login_service_1 = require("../shared/service/Auth0-login.service");
var navigate_service_1 = require("../shared/service/navigate.service");
// import {Page} from "ui/page";
// import {alert, setHintColor, LoginService, User} from "../shared";
var Auth0LoginComponent = (function () {
    function Auth0LoginComponent(router, navigateService, auth0LoginService) {
        this.router = router;
        this.navigateService = navigateService;
        this.auth0LoginService = auth0LoginService;
        if (!this.auth0LoginService.isLoggedIn) {
            this.doLogin();
        }
        else {
            this.gotonextpage();
        }
    }
    Auth0LoginComponent.prototype.doLogin = function () {
        //login with service.
        this.auth0LoginService.loginAndTo("/ping");
        //or: this.auth0LoginService.login ();
    };
    Auth0LoginComponent.prototype.doLogout = function () {
        console.log("Test doLogout function begin");
        if (this.auth0LoginService.isLoggedIn) {
            appSettings.remove("auth0Token");
            appSettings.remove("auth0UserData");
        }
        this.router.navigate(["/ping"]);
        console.log("Test doLogout function fini");
    };
    Auth0LoginComponent.prototype.gotonextpage = function () {
        //To do: Move the nexpage string to config
        this.router.navigate(["/ping"]);
    };
    Auth0LoginComponent.prototype.goToHome = function () {
        this.router.navigate(["/"]);
    };
    Auth0LoginComponent.prototype.showToken = function () {
        //To do: Move the nexpage string to config
        this.currentToken = appSettings.getString("auth0Token");
        console.log(this.currentToken);
        console.log("Test console function");
    };
    Auth0LoginComponent.prototype.test1 = function () {
    };
    Auth0LoginComponent.prototype.test2 = function () {
        this.test1();
        this.gotonextpage();
    };
    Auth0LoginComponent = __decorate([
        core_1.Component({
            selector: "my-auth0-login",
            templateUrl: "auth0-login/auth0-login.component.html",
            styleUrls: ["auth0-login/auth0-login-common.css", "auth0-login/auth0-login.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, navigate_service_1.NavigateService, Auth0_login_service_1.Auth0LoginService])
    ], Auth0LoginComponent);
    return Auth0LoginComponent;
}());
exports.Auth0LoginComponent = Auth0LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aDAtbG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aDAtbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBdUQsZUFBZSxDQUFDLENBQUE7QUFDdkUsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFHdkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLElBQVksV0FBVyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDcEQsb0NBQWdDLHVDQUF1QyxDQUFDLENBQUE7QUFDeEUsaUNBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFHbkUsZ0NBQWdDO0FBQ2hDLHFFQUFxRTtBQVFyRTtJQUtJLDZCQUFvQixNQUFhLEVBQ2IsZUFBK0IsRUFDM0MsaUJBQW1DO1FBRnZCLFdBQU0sR0FBTixNQUFNLENBQU87UUFDYixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFDM0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUd2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDdkIsQ0FBQztJQUlMLENBQUM7SUFHTSxxQ0FBTyxHQUFkO1FBRUkscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0Msc0NBQXNDO0lBRTFDLENBQUM7SUFFRCxzQ0FBUSxHQUFSO1FBRUksT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUFRLENBQUM7UUFHakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUUvQyxDQUFDO0lBRUQsMENBQVksR0FBWjtRQUVJLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFaEMsQ0FBQztJQUVNLHVDQUFTLEdBQWhCO1FBQ0ksMENBQTBDO1FBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELG1DQUFLLEdBQUw7SUFFQSxDQUFDO0lBRUQsbUNBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBNUVMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsV0FBVyxFQUFFLHdDQUF3QztZQUNyRCxTQUFTLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSx1Q0FBdUMsQ0FBQztTQUM3RixDQUFDOzsyQkFBQTtJQXlFRiwwQkFBQztBQUFELENBQUMsQUF4RUQsSUF3RUM7QUF4RVksMkJBQW1CLHNCQXdFL0IsQ0FBQSJ9