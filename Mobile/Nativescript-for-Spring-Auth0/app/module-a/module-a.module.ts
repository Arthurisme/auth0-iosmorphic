import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { moduleARouting } from "./module-a.routing";
import { ModuleAComponent } from "./module-a.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    moduleARouting
  ],
  declarations: [
    ModuleAComponent
  ]
})
export class ModuleAModule { }
