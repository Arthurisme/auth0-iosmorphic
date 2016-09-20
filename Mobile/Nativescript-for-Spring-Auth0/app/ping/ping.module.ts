import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NgModule } from "@angular/core";
// import { Http   }      from '@angular/http';


import { pingRouting } from "./ping.routing";
import { PingComponent } from "./ping.component";

@NgModule({

  providers: [
// Http,


  ],

  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,

    NativeScriptHttpModule,

    pingRouting
  ],
  declarations: [
    PingComponent
  ]
})
export class PingModule { }
