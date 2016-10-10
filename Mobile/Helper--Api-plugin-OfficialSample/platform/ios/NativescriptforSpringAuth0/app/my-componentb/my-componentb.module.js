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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY29tcG9uZW50Yi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJteS1jb21wb25lbnRiLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUsc0JBQXdDLDRCQUE0QixDQUFDLENBQUE7QUFDckUscUJBQXVDLDJCQUEyQixDQUFDLENBQUE7QUFDbkUscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLCtDQUErQztBQUcvQyxzQ0FBcUMseUJBQXlCLENBQUMsQ0FBQTtBQUMvRCx3Q0FBc0MsMkJBQTJCLENBQUMsQ0FBQTtBQUVsRSw4REFBOEQ7QUFDOUQsMkZBQTJGO0FBMEIzRjtJQUFBO0lBQWtDLENBQUM7SUF0Qm5DO1FBQUMsZUFBUSxDQUFDO1lBRVIsU0FBUyxFQUFFLEVBSVY7WUFFRCxPQUFPLEVBQUU7Z0JBQ1AsNkJBQWtCO2dCQUNsQiwrQkFBdUI7Z0JBRXZCLDZCQUFzQjtnQkFFdEIsMkNBQW1CO2FBQ3BCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLG1CQUFtQjtnQkFDbkIsd0JBQXdCO2dCQUN4QiwrQ0FBcUI7YUFDdEI7U0FDRixDQUFDOzswQkFBQTtJQUNnQyx5QkFBQztBQUFELENBQUMsQUFBbkMsSUFBbUM7QUFBdEIsMEJBQWtCLHFCQUFJLENBQUEifQ==