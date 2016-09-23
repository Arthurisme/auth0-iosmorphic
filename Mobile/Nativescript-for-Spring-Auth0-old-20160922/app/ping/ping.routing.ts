import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PingComponent } from "./ping.component";

const pingRoutes: Routes = [
  { path: "ping", component: PingComponent },
];
export const pingRouting: ModuleWithProviders = RouterModule.forChild(pingRoutes);