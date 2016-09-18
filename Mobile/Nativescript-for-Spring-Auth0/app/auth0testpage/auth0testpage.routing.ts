import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { Auth0testpageComponent } from "./auth0testpage.component";
import {AuthGuard} from "../auth-guard.service";

const auth0testpageRoutes: Routes = [
  // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
  { path: "auth0testpage", component: Auth0testpageComponent },
];
export const auth0testpageRouting: ModuleWithProviders = RouterModule.forChild(auth0testpageRoutes);