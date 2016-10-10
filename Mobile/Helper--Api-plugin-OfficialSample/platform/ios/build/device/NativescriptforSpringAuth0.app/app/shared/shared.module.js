//Not all the file in the shared directory are in shared.module!
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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var awesome_pipe_1 = require('./pipe/awesome.pipe');
var highlight_directive_1 = require('./directive/highlight.directive');
var my_custom_component_1 = require("./components/my-custom/my-custom.component");
// import {HeaderComponent} from "./header.component";
// import {CoreModule} from "../core/core.module";
var dropdown_directive_1 = require("../core/dropdown.directive");
var navigate_service_1 = require("./service/navigate.service");
var Auth0_login_service_1 = require("./service/Auth0-login.service");
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            providers: [
                navigate_service_1.NavigateService,
                Auth0_login_service_1.Auth0LoginService,
            ],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
            ],
            declarations: [
                awesome_pipe_1.AwesomePipe,
                highlight_directive_1.HighlightDirective,
                dropdown_directive_1.DropdownDirective,
                // HeaderComponent,
                my_custom_component_1.MyCustomComponent,
            ],
            exports: [
                awesome_pipe_1.AwesomePipe,
                highlight_directive_1.HighlightDirective,
                common_1.CommonModule,
                router_1.RouterModule,
                // CoreModule,
                forms_1.FormsModule,
                // HeaderComponent,
                my_custom_component_1.MyCustomComponent,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsZ0VBQWdFOzs7Ozs7Ozs7OztBQUVoRSxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFDcEQsdUJBQW9DLGlCQUFpQixDQUFDLENBQUE7QUFDdEQsdUJBQXFDLGlCQUFpQixDQUFDLENBQUE7QUFFdkQsc0JBQW9DLGdCQUFnQixDQUFDLENBQUE7QUFFckQsNkJBQW9DLHFCQUFxQixDQUFDLENBQUE7QUFDMUQsb0NBQW9DLGlDQUFpQyxDQUFDLENBQUE7QUFHdEUsb0NBQWdDLDRDQUE0QyxDQUFDLENBQUE7QUFDN0Usc0RBQXNEO0FBQ3RELGtEQUFrRDtBQUVsRCxtQ0FBZ0MsNEJBQTRCLENBQUMsQ0FBQTtBQUM3RCxpQ0FBOEIsNEJBQTRCLENBQUMsQ0FBQTtBQUMzRCxvQ0FBZ0MsK0JBQStCLENBQUMsQ0FBQTtBQXVEaEU7SUFBQTtJQUE0QixDQUFDO0lBbEQ3QjtRQUFDLGVBQVEsQ0FBQztZQUVSLFNBQVMsRUFBRTtnQkFDVCxrQ0FBZTtnQkFDZix1Q0FBaUI7YUFDbEI7WUFFRCxPQUFPLEVBQU87Z0JBQ1oscUJBQVk7Z0JBQ1oscUJBQVk7YUFLYjtZQUNELFlBQVksRUFBRTtnQkFJWiwwQkFBVztnQkFDWCx3Q0FBa0I7Z0JBQ2xCLHNDQUFpQjtnQkFFakIsbUJBQW1CO2dCQUNuQix1Q0FBaUI7YUFJbEI7WUFDRCxPQUFPLEVBQU87Z0JBR1osMEJBQVc7Z0JBQ1gsd0NBQWtCO2dCQUNsQixxQkFBWTtnQkFDWixxQkFBWTtnQkFDWixjQUFjO2dCQUNkLG1CQUFXO2dCQUVYLG1CQUFtQjtnQkFDbkIsdUNBQWlCO2FBUWxCO1NBQ0YsQ0FBQzs7b0JBQUE7SUFDMEIsbUJBQUM7QUFBRCxDQUFDLEFBQTdCLElBQTZCO0FBQWhCLG9CQUFZLGVBQUksQ0FBQTtBQUc3Qjs7OztFQUlFIn0=