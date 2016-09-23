"use strict";
var router_1 = require("@angular/router");
var login_component_1 = require("./login/login.component");
var list_component_1 = require("./list/list.component");
var groceriesRoutes = [
    // { path: "groceries", component: GroceriesComponent  },
    { path: "groceries", component: login_component_1.LoginComponent },
    { path: "list", component: list_component_1.ListComponent }
];
exports.groceriesRouting = router_1.RouterModule.forChild(groceriesRoutes);
//# sourceMappingURL=groceries.routing.js.map