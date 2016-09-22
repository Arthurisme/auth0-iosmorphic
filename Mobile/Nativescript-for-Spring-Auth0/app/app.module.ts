import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { NativeScriptRouterModule } from "nativescript-angular/router";
// import { HttpModule}      from '@angular/http';


import { NativeScriptHttpModule } from "nativescript-angular/http";


import { AppComponent } from "./app.component";


import { authProviders, appRoutes } from "./app.routing";
// import {   BackendService, LoginService } from "./shared";

// import { LoginModule } from "./login/login.module";
import { GroceriesModule } from "./modules/groceries/groceries.module";
import { Auth0LoginModule } from "./auth0-login/auth0-login.module";
// import { WebLoginModule } from "./web-login/web-login.module";
import { PingModule } from "./ping/ping.module";
import {Auth0LoginService} from "./shared/Auth0-login.service";




// import { LoginComponent } from "./modules/pages/login/login.component";
// import { ListComponent } from "./modules/pages/list/list.component";

import {HeaderComponent} from "./components/header/header.component";
import {MyComponentComponent} from "./components/mycomponent/mycomponent.component";
import {MyComponentbComponent} from "./modules/my-componentb/my-componentb.component";
// import {MyComponentbModule} from "./modules/my-componentb/my-componentb.module";




// setStatusBarColors();

@NgModule({
  declarations: [
    HeaderComponent,
    MyComponentComponent,
    MyComponentbComponent,


      AppComponent,

    // LoginComponent,
    // ListComponent

  ],

  providers: [
    // BackendService,
    // LoginService,



    Auth0LoginService,
    authProviders

  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,

    // HttpModule,
    NativeScriptHttpModule,


    NativeScriptRouterModule.forRoot(appRoutes),
    // LoginModule,
    GroceriesModule,
    Auth0LoginModule,
    // WebLoginModule,
    PingModule,
    // MyComponentbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
