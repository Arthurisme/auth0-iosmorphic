import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AppComponent } from "./app.component";


import { authProviders, appRoutes } from "./app.routing";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

import { LoginModule } from "./login/login.module";
import { GroceriesModule } from "./groceries/groceries.module";
import { Auth0LoginModule } from "./auth0-login/auth0-login.module";
import { PingModule } from "./ping/ping.module";
import {Auth0LoginService} from "./shared/Auth0-login.service";



setStatusBarColors();

@NgModule({
  declarations: [AppComponent],

  providers: [
    BackendService,
    LoginService,
    Auth0LoginService,
    authProviders

  ],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    GroceriesModule,
    Auth0LoginModule,
    PingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
