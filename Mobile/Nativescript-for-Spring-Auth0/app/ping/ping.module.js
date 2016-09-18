"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var ping_routing_1 = require("./ping.routing");
var ping_component_1 = require("./ping.component");
var PingModule = (function () {
    function PingModule() {
    }
    PingModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                ping_routing_1.pingRouting
            ],
            declarations: [
                ping_component_1.PingComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], PingModule);
    return PingModule;
}());
exports.PingModule = PingModule;
//# sourceMappingURL=ping.module.js.map