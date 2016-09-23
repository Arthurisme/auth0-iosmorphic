import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { auth0LoginRouting } from "./auth0-login.routing";
import { Auth0LoginComponent } from "./auth0-login.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    auth0LoginRouting
  ],
  declarations: [
    Auth0LoginComponent
  ]
})
export class Auth0LoginModule { }
