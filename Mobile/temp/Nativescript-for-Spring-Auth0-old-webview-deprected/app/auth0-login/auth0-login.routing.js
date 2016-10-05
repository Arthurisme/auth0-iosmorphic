"use strict";
var router_1 = require("@angular/router");
var auth0_login_component_1 = require("./auth0-login.component");
var auth0LoginRoutes = [
    // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
    { path: "auth0login", component: auth0_login_component_1.Auth0LoginComponent },
];
exports.auth0LoginRouting = router_1.RouterModule.forChild(auth0LoginRoutes);
//# sourceMappingURL=auth0-login.routing.js.map