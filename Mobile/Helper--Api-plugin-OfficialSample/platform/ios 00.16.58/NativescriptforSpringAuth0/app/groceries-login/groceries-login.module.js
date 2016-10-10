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
var groceries_login_routing_1 = require("./groceries-login.routing");
var groceries_login_component_1 = require("./groceries-login.component");
var shared_module_1 = require("../shared/shared.module");
var GroceriesLoginModule = (function () {
    function GroceriesLoginModule() {
    }
    GroceriesLoginModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                groceries_login_routing_1.groceriesLoginRouting
            ],
            declarations: [
                groceries_login_component_1.GroceriesLoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], GroceriesLoginModule);
    return GroceriesLoginModule;
}());
exports.GroceriesLoginModule = GroceriesLoginModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLWxvZ2luLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy1sb2dpbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUFtQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ25FLHNCQUF3Qyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3JFLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUV6Qyx3Q0FBc0MsMkJBQTJCLENBQUMsQ0FBQTtBQUNsRSwwQ0FBd0MsNkJBQTZCLENBQUMsQ0FBQTtBQUN0RSw4QkFBMkIseUJBQXlCLENBQUMsQ0FBQTtBQWVyRDtJQUFBO0lBQW9DLENBQUM7SUFickM7UUFBQyxlQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsNEJBQVk7Z0JBR1osNkJBQWtCO2dCQUNsQiwrQkFBdUI7Z0JBQ3ZCLCtDQUFxQjthQUN0QjtZQUNELFlBQVksRUFBRTtnQkFDWixtREFBdUI7YUFDeEI7U0FDRixDQUFDOzs0QkFBQTtJQUNrQywyQkFBQztBQUFELENBQUMsQUFBckMsSUFBcUM7QUFBeEIsNEJBQW9CLHVCQUFJLENBQUEifQ==