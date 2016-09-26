import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

import { LoginModule } from "./login/login.module";
import { GroceriesModule } from "./groceries/groceries.module";
import {PingModule} from "./ping/ping.module";
import {ModuleAModule} from "./module-a/module-a.module";
import {SharedModule} from "./shared/shared.module";
import {Auth0LoginModule} from "./auth0-login/auth0-login.module";
// import {Auth0LoginService} from "./shared/Auth0-login.service";

setStatusBarColors();

@NgModule({
  providers: [
    BackendService,
    LoginService,

    // Auth0LoginService,


    authProviders
  ],
  imports: [
    SharedModule,



    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),

    Auth0LoginModule,

    LoginModule,
    GroceriesModule,

    PingModule,

    ModuleAModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
