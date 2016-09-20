import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
// import { HttpModule}      from '@angular/http';


import { NativeScriptHttpModule } from "nativescript-angular/http";


import { AppComponent } from "./app.component";


import { authProviders, appRoutes } from "./app.routing";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

// import { LoginModule } from "./login/login.module";
// import { GroceriesModule } from "./groceries/groceries.module";
import { Auth0LoginModule } from "./auth0-login/auth0-login.module";
// import { WebLoginModule } from "./web-login/web-login.module";
import { PingModule } from "./ping/ping.module";
import {Auth0LoginService} from "./shared/Auth0-login.service";




import { LoginComponent } from "./pages/login/login.component";
import { ListComponent } from "./pages/list/list.component";



setStatusBarColors();

@NgModule({
  declarations: [
      AppComponent,

    LoginComponent,
    ListComponent

  ],

  providers: [
    BackendService,
    LoginService,



    Auth0LoginService,
    authProviders

  ],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,

    // HttpModule,
    NativeScriptHttpModule,


    NativeScriptRouterModule.forRoot(appRoutes),
    // LoginModule,
    // GroceriesModule,
    Auth0LoginModule,
    // WebLoginModule,
    PingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
