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
var login_routing_1 = require("./login.routing");
var login_component_1 = require("./login.component");
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                login_routing_1.loginRouting
            ],
            declarations: [
                login_component_1.LoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5QkFBbUMsK0JBQStCLENBQUMsQ0FBQTtBQUNuRSxzQkFBd0MsNEJBQTRCLENBQUMsQ0FBQTtBQUNyRSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFFekMsOEJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MsZ0NBQStCLG1CQUFtQixDQUFDLENBQUE7QUFZbkQ7SUFBQTtJQUEyQixDQUFDO0lBVjVCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qiw0QkFBWTthQUNiO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLGdDQUFjO2FBQ2Y7U0FDRixDQUFDOzttQkFBQTtJQUN5QixrQkFBQztBQUFELENBQUMsQUFBNUIsSUFBNEI7QUFBZixtQkFBVyxjQUFJLENBQUEifQ==