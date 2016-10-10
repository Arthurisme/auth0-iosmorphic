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
var core_1 = require("@angular/core");
var auth0_login_routing_1 = require("./auth0-login.routing");
var auth0_login_component_1 = require("./auth0-login.component");
var shared_module_1 = require("../shared/shared.module");
var Auth0LoginModule = (function () {
    function Auth0LoginModule() {
    }
    Auth0LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                auth0_login_routing_1.auth0LoginRouting,
                shared_module_1.SharedModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aDAtbG9naW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aDAtbG9naW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5QkFBbUMsK0JBQStCLENBQUMsQ0FBQTtBQUNuRSxzQkFBd0MsNEJBQTRCLENBQUMsQ0FBQTtBQUNyRSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFFekMsb0NBQWtDLHVCQUF1QixDQUFDLENBQUE7QUFDMUQsc0NBQW9DLHlCQUF5QixDQUFDLENBQUE7QUFDOUQsOEJBQTJCLHlCQUF5QixDQUFDLENBQUE7QUFlckQ7SUFBQTtJQUFnQyxDQUFDO0lBYmpDO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qix1Q0FBaUI7Z0JBRWpCLDRCQUFZO2FBRWI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osMkNBQW1CO2FBQ3BCO1NBQ0YsQ0FBQzs7d0JBQUE7SUFDOEIsdUJBQUM7QUFBRCxDQUFDLEFBQWpDLElBQWlDO0FBQXBCLHdCQUFnQixtQkFBSSxDQUFBIn0=