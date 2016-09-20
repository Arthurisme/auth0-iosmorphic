import { Routes } from "@angular/router";
import { AuthGuard } from "./auth-guard.service";


import { LoginComponent } from "./pages/login/login.component";
import { ListComponent } from "./pages/list/list.component";

export const authProviders = [
  AuthGuard
];

export const appRoutes: Routes = [
  // { path: "", redirectTo: "/groceries", pathMatch: "full" }
  { path: "", redirectTo: "/auth0login", pathMatch: "full" }
  // { path: "", redirectTo: "/weblogin", pathMatch: "full" }

  //
  // { path: "", component: LoginComponent },
  // { path: "list", component: ListComponent }

];