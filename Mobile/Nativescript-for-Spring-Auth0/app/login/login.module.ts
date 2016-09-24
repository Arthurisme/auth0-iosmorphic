import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { loginRouting } from "./login.routing";
import { LoginComponent } from "./login.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,


    NativeScriptModule,
    NativeScriptFormsModule,
    loginRouting
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
