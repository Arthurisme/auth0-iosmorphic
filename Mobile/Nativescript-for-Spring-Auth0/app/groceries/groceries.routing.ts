import { ModuleWithProviders }  from "@angular/core";
// import { Routes, RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

import { GroceriesComponent } from "./groceries.component";
import { AuthGuardGroceries } from "./auth-guard-groceries.service";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {AuthGuard} from "../auth-guard.service";

const groceriesRoutes: Routes = [
  // { path: "groceries", component: GroceriesComponent, canActivate: [AuthGuard] },
  { path: "groceries", component: GroceriesComponent },
];
export const groceriesRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(groceriesRoutes);