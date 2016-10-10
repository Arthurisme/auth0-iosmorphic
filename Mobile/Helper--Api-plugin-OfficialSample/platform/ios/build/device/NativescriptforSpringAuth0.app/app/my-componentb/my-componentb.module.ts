import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NgModule } from "@angular/core";
// import { Http   }      from '@angular/http';


import {  myComponentbRouting } from "./my-componentb.routing";
import { MyComponentbComponent } from "./my-componentb.component";

// import {HeaderComponent} from "../header/header.component";
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";



@NgModule({

  providers: [
// Http,


  ],

  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,

    NativeScriptHttpModule,

    myComponentbRouting
  ],
  declarations: [
    // HeaderComponent,
    // MyComponentComponent,
    MyComponentbComponent
  ]
})
export class MyComponentbModule { }
