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
var shared_1 = require("./shared");
var Auth0_login_service_1 = require("./shared/service/Auth0-login.service");
var AuthGuard = (function () {
    function AuthGuard(router, loginService, auth0LoginService) {
        this.router = router;
        this.loginService = loginService;
        this.auth0LoginService = auth0LoginService;
    }
    AuthGuard.prototype.canActivate = function () {
        console.log("path is:" + this.router.url);
        if (this.auth0LoginService.isLoggedIn) {
            return true;
        }
        else {
            this.router.navigate(["/auth0login"]);
            return false;
        }
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.LoginService, Auth0_login_service_1.Auth0LoginService])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsdUJBQW9DLGlCQUFpQixDQUFDLENBQUE7QUFHdEQsdUJBQTZCLFVBQVUsQ0FBQyxDQUFBO0FBQ3hDLG9DQUFnQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBR3ZFO0lBQ0UsbUJBQ1ksTUFBYyxFQUNkLFlBQTBCLEVBQzFCLGlCQUFtQztRQUZuQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtJQUMzQyxDQUFDO0lBRUwsK0JBQVcsR0FBWDtRQUVFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7SUFuQkg7UUFBQyxpQkFBVSxFQUFFOztpQkFBQTtJQW9DYixnQkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksaUJBQVMsWUFtQ3JCLENBQUEifQ==