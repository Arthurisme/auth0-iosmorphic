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
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var core_1 = require("@angular/core");
// import { Http   }      from '@angular/http';
var ping_routing_1 = require("./ping.routing");
var ping_component_1 = require("./ping.component");
var shared_module_1 = require("../shared/shared.module");
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";
var PingModule = (function () {
    function PingModule() {
    }
    PingModule = __decorate([
        core_1.NgModule({
            providers: [],
            imports: [
                shared_module_1.SharedModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUsc0JBQXdDLDRCQUE0QixDQUFDLENBQUE7QUFDckUscUJBQXVDLDJCQUEyQixDQUFDLENBQUE7QUFDbkUscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLCtDQUErQztBQUcvQyw2QkFBNEIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM3QywrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUtqRCw4QkFBMkIseUJBQXlCLENBQUMsQ0FBQTtBQUVyRCwyRkFBMkY7QUFpQzNGO0lBQUE7SUFBMEIsQ0FBQztJQTdCM0I7UUFBQyxlQUFRLENBQUM7WUFFUixTQUFTLEVBQUUsRUFJVjtZQUVELE9BQU8sRUFBRTtnQkFDUCw0QkFBWTtnQkFFWiw2QkFBa0I7Z0JBQ2xCLCtCQUF1QjtnQkFFdkIsNkJBQXNCO2dCQUd0QixzQkFBc0I7Z0JBR3RCLDBCQUFXO2FBQ1o7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osbUJBQW1CO2dCQUNuQix3QkFBd0I7Z0JBQ3hCLHlCQUF5QjtnQkFDekIsOEJBQWE7YUFDZDtTQUNGLENBQUM7O2tCQUFBO0lBQ3dCLGlCQUFDO0FBQUQsQ0FBQyxBQUEzQixJQUEyQjtBQUFkLGtCQUFVLGFBQUksQ0FBQSJ9