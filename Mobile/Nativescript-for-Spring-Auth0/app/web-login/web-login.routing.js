"use strict";
var router_1 = require("@angular/router");
var web_login_component_1 = require("./web-login.component");
var webLoginRoutes = [
    // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
    { path: "weblogin", component: web_login_component_1.WebLoginComponent },
];
exports.webLoginRouting = router_1.RouterModule.forChild(webLoginRoutes);
//# sourceMappingURL=web-login.routing.js.map