"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var core_1 = require("@angular/core");
// import { Http   }      from '@angular/http';
var ping_routing_1 = require("./ping.routing");
var ping_component_1 = require("./ping.component");
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";
var PingModule = (function () {
    function PingModule() {
    }
    PingModule = __decorate([
        core_1.NgModule({
            providers: [],
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                // MyComponentbModule,
                ping_routing_1.pingRouting
            ],
            declarations: [
                // HeaderComponent,
                // MyComponentComponent,
                // MyComponentbComponent,
                ping_component_1.PingComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], PingModule);
    return PingModule;
}());
exports.PingModule = PingModule;
//# sourceMappingURL=ping.module.js.map