import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NgModule } from "@angular/core";
// import { Http   }      from '@angular/http';


import { pingRouting } from "./ping.routing";
import { PingComponent } from "./ping.component";
// import {MyComponentbModule} from "../../modules/my-componentb/my-componentb.module";

// import {HeaderComponent} from "../header/header.component";
import {MyComponentbComponent} from "../my-componentb/my-componentb.component";
import {SharedModule} from "../shared/shared.module";

// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";



@NgModule({

  providers: [
// Http,


  ],

  imports: [
    SharedModule,

    NativeScriptModule,
    NativeScriptFormsModule,

    NativeScriptHttpModule,


    // MyComponentbModule,


    pingRouting
  ],
  declarations: [
    // HeaderComponent,
    // MyComponentComponent,
    // MyComponentbComponent,
    PingComponent
  ]
})
export class PingModule { }
