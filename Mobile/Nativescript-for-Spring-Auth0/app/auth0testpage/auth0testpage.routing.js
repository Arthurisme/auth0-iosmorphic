"use strict";
var router_1 = require("@angular/router");
var auth0testpage_component_1 = require("./auth0testpage.component");
var auth0testpageRoutes = [
    // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
    { path: "auth0testpage", component: auth0testpage_component_1.Auth0testpageComponent },
];
exports.auth0testpageRouting = router_1.RouterModule.forChild(auth0testpageRoutes);
//# sourceMappingURL=auth0testpage.routing.js.map