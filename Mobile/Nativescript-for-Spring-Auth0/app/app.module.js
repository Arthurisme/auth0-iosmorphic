"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var shared_1 = require("./shared");
var login_module_1 = require("./login/login.module");
var groceries_module_1 = require("./groceries/groceries.module");
var auth0_login_module_1 = require("./auth0-login/auth0-login.module");
var ping_module_1 = require("./ping/ping.module");
var Auth0_login_service_1 = require("./shared/Auth0-login.service");
shared_1.setStatusBarColors();
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent],
            providers: [
                shared_1.BackendService,
                shared_1.LoginService,
                Auth0_login_service_1.Auth0LoginService,
                app_routing_1.authProviders
            ],
            imports: [
                platform_1.NativeScriptModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.appRoutes),
                login_module_1.LoginModule,
                groceries_module_1.GroceriesModule,
                auth0_login_module_1.Auth0LoginModule,
                ping_module_1.PingModule
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map