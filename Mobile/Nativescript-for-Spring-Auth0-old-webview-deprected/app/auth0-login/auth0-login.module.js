"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var auth0_login_routing_1 = require("./auth0-login.routing");
var auth0_login_component_1 = require("./auth0-login.component");
var Auth0LoginModule = (function () {
    function Auth0LoginModule() {
    }
    Auth0LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                auth0_login_routing_1.auth0LoginRouting
            ],
            declarations: [
                auth0_login_component_1.Auth0LoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Auth0LoginModule);
    return Auth0LoginModule;
}());
exports.Auth0LoginModule = Auth0LoginModule;
//# sourceMappingURL=auth0-login.module.js.map