import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { webLoginRouting } from "./web-login.routing";
import { WebLoginComponent } from "./web-login.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    webLoginRouting
  ],
  declarations: [
    WebLoginComponent
  ]
})
export class WebLoginModule { }
