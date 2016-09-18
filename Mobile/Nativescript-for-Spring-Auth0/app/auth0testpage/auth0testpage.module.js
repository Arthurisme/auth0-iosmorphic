"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var auth0testpage_routing_1 = require("./auth0testpage.routing");
var auth0testpage_component_1 = require("./auth0testpage.component");
var Auth0testpageModule = (function () {
    function Auth0testpageModule() {
    }
    Auth0testpageModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                auth0testpage_routing_1.auth0testpageRouting
            ],
            declarations: [
                auth0testpage_component_1.Auth0testpageComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Auth0testpageModule);
    return Auth0testpageModule;
}());
exports.Auth0testpageModule = Auth0testpageModule;
//# sourceMappingURL=auth0testpage.module.js.map