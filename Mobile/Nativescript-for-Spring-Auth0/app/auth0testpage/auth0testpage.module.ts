import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { auth0testpageRouting } from "./auth0testpage.routing";
import { Auth0testpageComponent } from "./auth0testpage.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    auth0testpageRouting
  ],
  declarations: [
    Auth0testpageComponent
  ]
})
export class Auth0testpageModule { }
