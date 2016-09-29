"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var HeaderService = (function () {
    function HeaderService(router) {
        this.router = router;
        // if (this.token) {
        //   this.backend.el.authentication.setAuthorization(this.token, "bearer");
        // }
    }
    // register(user: User) {
    //   return this.backend.el.Users.register(user.email, user.password)
    //     .catch(this.handleErrors);
    // }
    HeaderService.prototype.goToGroceries = function () {
        this.router.navigate(["/groceries"]);
    };
    HeaderService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    HeaderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router])
    ], HeaderService);
    return HeaderService;
}());
exports.HeaderService = HeaderService;
//# sourceMappingURL=header.service.js.map