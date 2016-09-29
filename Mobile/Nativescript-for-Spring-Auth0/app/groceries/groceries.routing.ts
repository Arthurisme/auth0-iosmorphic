import { ModuleWithProviders }  from "@angular/core";
// import { Routes, RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

import { GroceriesComponent } from "./groceries.component";
import { AuthGuard } from "../auth-guard.service";
import {NativeScriptRouterModule} from "nativescript-angular/router";

const groceriesRoutes: Routes = [
  { path: "groceries", component: GroceriesComponent, canActivate: [AuthGuard] },
];
export const groceriesRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(groceriesRoutes);