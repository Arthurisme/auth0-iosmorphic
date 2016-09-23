"use strict";
var auth_guard_service_1 = require("./auth-guard.service");
exports.authProviders = [
    auth_guard_service_1.AuthGuard
];
exports.appRoutes = [
    { path: "", redirectTo: "/groceries", pathMatch: "full" }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQTBCLHNCQUFzQixDQUFDLENBQUE7QUFFcEMscUJBQWEsR0FBRztJQUMzQiw4QkFBUztDQUNWLENBQUM7QUFFVyxpQkFBUyxHQUFHO0lBQ3ZCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7Q0FDMUQsQ0FBQyJ9