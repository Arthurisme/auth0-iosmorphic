import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { Auth0LoginComponent } from "./auth0-login.component";
import {AuthGuard} from "../auth-guard.service";

const auth0LoginRoutes: Routes = [
  // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
  { path: "auth0login", component: Auth0LoginComponent },
];
export const auth0LoginRouting: ModuleWithProviders = RouterModule.forChild(auth0LoginRoutes);