import { AuthGuard } from "./auth-guard.service";

export const authProviders = [
  AuthGuard
];

export const appRoutes = [
  // { path: "", redirectTo: "/groceries", pathMatch: "full" }
  { path: "", redirectTo: "/auth0login" , pathMatch: "full" },

  // { path: "", redirectTo: "/ping", pathMatch: "full" }
];
