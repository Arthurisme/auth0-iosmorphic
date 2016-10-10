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
var shared_1 = require("../shared");
var Auth0_login_service_1 = require("../shared/service/Auth0-login.service");
var AuthGuardGroceries = (function () {
    function AuthGuardGroceries(router, loginService, auth0LoginService) {
        this.router = router;
        this.loginService = loginService;
        this.auth0LoginService = auth0LoginService;
    }
    AuthGuardGroceries.prototype.canActivate = function () {
        if (this.loginService.isLoggedIn) {
            return true;
        }
        else {
            this.router.navigate(["/login"]);
            return false;
        }
    };
    AuthGuardGroceries = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.LoginService, Auth0_login_service_1.Auth0LoginService])
    ], AuthGuardGroceries);
    return AuthGuardGroceries;
}());
exports.AuthGuardGroceries = AuthGuardGroceries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC1ncm9jZXJpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dGgtZ3VhcmQtZ3JvY2VyaWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyx1QkFBb0MsaUJBQWlCLENBQUMsQ0FBQTtBQUV0RCx1QkFBNkIsV0FBVyxDQUFDLENBQUE7QUFDekMsb0NBQWdDLHVDQUF1QyxDQUFDLENBQUE7QUFHeEU7SUFDRSw0QkFDWSxNQUFjLEVBQ2QsWUFBMEIsRUFDMUIsaUJBQW1DO1FBRm5DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO0lBQzNDLENBQUM7SUFFTCx3Q0FBVyxHQUFYO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBaEJIO1FBQUMsaUJBQVUsRUFBRTs7MEJBQUE7SUFtQmIseUJBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBbEJZLDBCQUFrQixxQkFrQjlCLENBQUEifQ==