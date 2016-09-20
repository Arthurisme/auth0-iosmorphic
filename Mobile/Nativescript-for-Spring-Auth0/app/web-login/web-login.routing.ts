import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WebLoginComponent } from "./web-login.component";
import {AuthGuard} from "../auth-guard.service";

const webLoginRoutes: Routes = [
  // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
  { path: "weblogin", component: WebLoginComponent },
];
export const webLoginRouting: ModuleWithProviders = RouterModule.forChild(webLoginRoutes);