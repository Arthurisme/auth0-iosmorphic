"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var router_1 = require("nativescript-angular/router");
// import { HttpModule}      from '@angular/http';
var http_1 = require("nativescript-angular/http");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
// import {   BackendService, LoginService } from "./shared";
// import { LoginModule } from "./login/login.module";
var groceries_module_1 = require("./modules/groceries/groceries.module");
var auth0_login_module_1 = require("./auth0-login/auth0-login.module");
// import { WebLoginModule } from "./web-login/web-login.module";
var ping_module_1 = require("./ping/ping.module");
var Auth0_login_service_1 = require("./shared/Auth0-login.service");
// import { LoginComponent } from "./modules/pages/login/login.component";
// import { ListComponent } from "./modules/pages/list/list.component";
var header_component_1 = require("./components/header/header.component");
var mycomponent_component_1 = require("./components/mycomponent/mycomponent.component");
var my_componentb_component_1 = require("./modules/my-componentb/my-componentb.component");
// import {MyComponentbModule} from "./modules/my-componentb/my-componentb.module";
// setStatusBarColors();
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                header_component_1.HeaderComponent,
                mycomponent_component_1.MyComponentComponent,
                my_componentb_component_1.MyComponentbComponent,
                app_component_1.AppComponent,
            ],
            providers: [
                // BackendService,
                // LoginService,
                Auth0_login_service_1.Auth0LoginService,
                app_routing_1.authProviders
            ],
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                router_1.NativeScriptRouterModule,
                // HttpModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.appRoutes),
                // LoginModule,
                groceries_module_1.GroceriesModule,
                auth0_login_module_1.Auth0LoginModule,
                // WebLoginModule,
                ping_module_1.PingModule,
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map