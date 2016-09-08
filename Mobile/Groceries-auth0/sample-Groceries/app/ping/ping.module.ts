import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { pingRouting } from "./ping.routing";
import { PingComponent } from "./ping.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    pingRouting
  ],
  declarations: [
    PingComponent
  ]
})
export class PingModule { }
