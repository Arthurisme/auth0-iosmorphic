import { ModuleWithProviders }  from "@angular/core";
import { Routes } from "@angular/router";

import {  ModuleAComponent} from "./module-a.component";
import {NativeScriptRouterModule} from "nativescript-angular/router";

const moduleARoutes: Routes = [
  { path: "modulea", component: ModuleAComponent },
];
export const moduleARouting: ModuleWithProviders = NativeScriptRouterModule.forChild(moduleARoutes);