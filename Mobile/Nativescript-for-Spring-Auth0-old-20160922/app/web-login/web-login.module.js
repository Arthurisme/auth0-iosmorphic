"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var web_login_routing_1 = require("./web-login.routing");
var web_login_component_1 = require("./web-login.component");
var WebLoginModule = (function () {
    function WebLoginModule() {
    }
    WebLoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                web_login_routing_1.webLoginRouting
            ],
            declarations: [
                web_login_component_1.WebLoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], WebLoginModule);
    return WebLoginModule;
}());
exports.WebLoginModule = WebLoginModule;
//# sourceMappingURL=web-login.module.js.map