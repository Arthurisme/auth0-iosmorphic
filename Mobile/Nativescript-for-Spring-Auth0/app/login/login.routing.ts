import { ModuleWithProviders }  from "@angular/core";
import { Routes } from "@angular/router";

import { LoginComponent } from "./login.component";
import {NativeScriptRouterModule} from "nativescript-angular/router";

const loginRoutes: Routes = [
  { path: "login", component: LoginComponent },
];
export const loginRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(loginRoutes);