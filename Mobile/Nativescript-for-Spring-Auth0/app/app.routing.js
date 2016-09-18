"use strict";
var auth_guard_service_1 = require("./auth-guard.service");
exports.authProviders = [
    auth_guard_service_1.AuthGuard
];
exports.appRoutes = [
    // { path: "", redirectTo: "/groceries", pathMatch: "full" }
    { path: "", redirectTo: "/auth0login", pathMatch: "full" }
];
//# sourceMappingURL=app.routing.js.map