"use strict";
var ping_component_1 = require("./ping.component");
var router_1 = require("nativescript-angular/router");
var auth_guard_service_1 = require("../auth-guard.service");
var pingRoutes = [
    { path: "ping", component: ping_component_1.PingComponent, canActivate: [auth_guard_service_1.AuthGuard] },
];
// export const pingRouting: ModuleWithProviders = RouterModule.forChild(pingRoutes);
exports.pingRouting = router_1.NativeScriptRouterModule.forChild(pingRoutes);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5yb3V0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGluZy5yb3V0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQSwrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUNqRCx1QkFBdUMsNkJBQTZCLENBQUMsQ0FBQTtBQUNyRSxtQ0FBd0IsdUJBQXVCLENBQUMsQ0FBQTtBQUVoRCxJQUFNLFVBQVUsR0FBVztJQUN6QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUUsV0FBVyxFQUFFLENBQUMsOEJBQVMsQ0FBQyxFQUFFO0NBQ3JFLENBQUM7QUFDRixxRkFBcUY7QUFDeEUsbUJBQVcsR0FBd0IsaUNBQXdCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDIn0=