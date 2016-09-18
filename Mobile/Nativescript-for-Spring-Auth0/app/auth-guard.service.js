"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Auth0_login_service_1 = require("./shared/Auth0-login.service");
var AuthGuard = (function () {
    function AuthGuard(router, auth0LoginService) {
        this.router = router;
        this.auth0LoginService = auth0LoginService;
    }
    AuthGuard.prototype.canActivate = function () {
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
        __metadata('design:paramtypes', [router_1.Router, Auth0_login_service_1.Auth0LoginService])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map