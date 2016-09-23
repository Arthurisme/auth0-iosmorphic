import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MyComponentbComponent } from "./my-componentb.component";

const myComponentbRoutes: Routes = [
  { path: "mycomponentb", component: MyComponentbComponent },
];
export const myComponentbRouting: ModuleWithProviders = RouterModule.forChild(myComponentbRoutes);