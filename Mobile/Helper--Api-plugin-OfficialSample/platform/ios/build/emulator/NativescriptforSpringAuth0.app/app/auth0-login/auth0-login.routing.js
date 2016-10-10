"use strict";
var auth0_login_component_1 = require("./auth0-login.component");
var router_1 = require("nativescript-angular/router");
var auth0LoginRoutes = [
    // { path: "auth0testpage", component: Auth0testpageComponent, canActivate: [AuthGuard]  },
    { path: "auth0login", component: auth0_login_component_1.Auth0LoginComponent },
];
exports.auth0LoginRouting = router_1.NativeScriptRouterModule.forChild(auth0LoginRoutes);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aDAtbG9naW4ucm91dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dGgwLWxvZ2luLnJvdXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLHNDQUFvQyx5QkFBeUIsQ0FBQyxDQUFBO0FBRTlELHVCQUF1Qyw2QkFBNkIsQ0FBQyxDQUFBO0FBRXJFLElBQU0sZ0JBQWdCLEdBQVc7SUFDL0IsMkZBQTJGO0lBQzNGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsMkNBQW1CLEVBQUU7Q0FDdkQsQ0FBQztBQUNXLHlCQUFpQixHQUF3QixpQ0FBd0IsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyJ9