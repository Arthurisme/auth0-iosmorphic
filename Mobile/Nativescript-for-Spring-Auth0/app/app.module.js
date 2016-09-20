"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
// import { HttpModule}      from '@angular/http';
var http_1 = require("nativescript-angular/http");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var shared_1 = require("./shared");
// import { LoginModule } from "./login/login.module";
// import { GroceriesModule } from "./groceries/groceries.module";
var auth0_login_module_1 = require("./auth0-login/auth0-login.module");
// import { WebLoginModule } from "./web-login/web-login.module";
var ping_module_1 = require("./ping/ping.module");
var Auth0_login_service_1 = require("./shared/Auth0-login.service");
var login_component_1 = require("./pages/login/login.component");
var list_component_1 = require("./pages/list/list.component");
shared_1.setStatusBarColors();
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                list_component_1.ListComponent
            ],
            providers: [
                shared_1.BackendService,
                shared_1.LoginService,
                Auth0_login_service_1.Auth0LoginService,
                app_routing_1.authProviders
            ],
            imports: [
                platform_1.NativeScriptModule,
                router_1.NativeScriptRouterModule,
                // HttpModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.appRoutes),
                // LoginModule,
                // GroceriesModule,
                auth0_login_module_1.Auth0LoginModule,
                // WebLoginModule,
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