"use strict";
var core_1 = require('@angular/core');
// import {Auth} from "../../auth.service";
var http_1 = require('@angular/http');
var router_1 = require("@angular/router");
var HeaderComponent = (function () {
    function HeaderComponent(router, http) {
        this.router = router;
        this.http = http;
    }
    HeaderComponent.prototype.goToGroceries = function () {
        this.router.navigate(["/groceries"]);
    };
    HeaderComponent = __decorate([
        core_1.Component({
            // moduleId: module.id,
            selector: "actionbar-header",
            templateUrl: "components/header/header.component.html",
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map