import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { groceriesLoginRouting } from "./groceries-login.routing";
import { GroceriesLoginComponent } from "./groceries-login.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,


    NativeScriptModule,
    NativeScriptFormsModule,
    groceriesLoginRouting
  ],
  declarations: [
    GroceriesLoginComponent
  ]
})
export class GroceriesLoginModule { }
