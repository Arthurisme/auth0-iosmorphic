import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import {  ModuleAComponent} from "./module-a.component";

const moduleARoutes: Routes = [
  { path: "modulea", component: ModuleAComponent },
];
export const moduleARouting: ModuleWithProviders = RouterModule.forChild(moduleARoutes);