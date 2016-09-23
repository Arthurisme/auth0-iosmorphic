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
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var shared_1 = require("./shared");
var login_module_1 = require("./login/login.module");
var groceries_module_1 = require("./groceries/groceries.module");
shared_1.setStatusBarColors();
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                shared_1.BackendService,
                shared_1.LoginService,
                app_routing_1.authProviders
            ],
            imports: [
                platform_1.NativeScriptModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.appRoutes),
                login_module_1.LoginModule,
                groceries_module_1.GroceriesModule,
            ],
            declarations: [
                app_component_1.AppComponent,
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUFtQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ25FLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6Qyx1QkFBeUMsNkJBQTZCLENBQUMsQ0FBQTtBQUV2RSw0QkFBeUMsZUFBZSxDQUFDLENBQUE7QUFDekQsOEJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MsdUJBQWlFLFVBQVUsQ0FBQyxDQUFBO0FBRTVFLDZCQUE0QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ25ELGlDQUFnQyw4QkFBOEIsQ0FBQyxDQUFBO0FBRS9ELDJCQUFrQixFQUFFLENBQUM7QUFvQnJCO0lBQUE7SUFBeUIsQ0FBQztJQWxCMUI7UUFBQyxlQUFRLENBQUM7WUFDUixTQUFTLEVBQUU7Z0JBQ1QsdUJBQWM7Z0JBQ2QscUJBQVk7Z0JBQ1osMkJBQWE7YUFDZDtZQUNELE9BQU8sRUFBRTtnQkFDUCw2QkFBa0I7Z0JBQ2xCLGlDQUF3QjtnQkFDeEIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLHVCQUFTLENBQUM7Z0JBQzNDLDBCQUFXO2dCQUNYLGtDQUFlO2FBQ2hCO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLDRCQUFZO2FBQ2Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1NBQzFCLENBQUM7O2lCQUFBO0lBQ3VCLGdCQUFDO0FBQUQsQ0FBQyxBQUExQixJQUEwQjtBQUFiLGlCQUFTLFlBQUksQ0FBQSJ9