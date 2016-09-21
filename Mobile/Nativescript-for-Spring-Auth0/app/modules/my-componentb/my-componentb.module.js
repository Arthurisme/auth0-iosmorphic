"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var core_1 = require("@angular/core");
// import { Http   }      from '@angular/http';
var my_componentb_routing_1 = require("./my-componentb.routing");
var my_componentb_component_1 = require("./my-componentb.component");
// import {HeaderComponent} from "../header/header.component";
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";
var MyComponentbModule = (function () {
    function MyComponentbModule() {
    }
    MyComponentbModule = __decorate([
        core_1.NgModule({
            providers: [],
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                my_componentb_routing_1.myComponentbRouting
            ],
            declarations: [
                // HeaderComponent,
                // MyComponentComponent,
                my_componentb_component_1.MyComponentbComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], MyComponentbModule);
    return MyComponentbModule;
}());
exports.MyComponentbModule = MyComponentbModule;
//# sourceMappingURL=my-componentb.module.js.map