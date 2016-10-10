import { ModuleWithProviders }  from "@angular/core";
import { Routes } from "@angular/router";

import { MyComponentbComponent } from "./my-componentb.component";
import {NativeScriptRouterModule} from "nativescript-angular/router";

const myComponentbRoutes: Routes = [
  { path: "mycomponentb", component: MyComponentbComponent },
];
export const myComponentbRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(myComponentbRoutes);