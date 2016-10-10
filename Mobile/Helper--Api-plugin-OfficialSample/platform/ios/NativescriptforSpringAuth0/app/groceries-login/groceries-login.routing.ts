import { ModuleWithProviders }  from "@angular/core";
import { Routes } from "@angular/router";

import { GroceriesLoginComponent } from "./groceries-login.component";
import {NativeScriptRouterModule} from "nativescript-angular/router";

const groceriesLoginRoutes: Routes = [
  { path: "grocerieslogin", component: GroceriesLoginComponent },
];
export const groceriesLoginRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(groceriesLoginRoutes);