import { ModuleWithProviders }  from "@angular/core";
// import { Routes, RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

import { PingComponent } from "./ping.component";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {AuthGuard} from "../auth-guard.service";

const pingRoutes: Routes = [
  // { path: "ping", component: PingComponent, canActivate: [AuthGuard] },
  { path: "ping", component: PingComponent  },
];
// export const pingRouting: ModuleWithProviders = RouterModule.forChild(pingRoutes);
export const pingRouting: ModuleWithProviders = NativeScriptRouterModule.forChild(pingRoutes);