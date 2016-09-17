"use strict";
var router_1 = require('@angular/router');
var recipes_component_1 = require("./recipes/recipes.component");
var shopping_list_component_1 = require("./shopping-list/shopping-list.component");
var recipes_routes_1 = require("./recipes/recipes.routes");
var APP_ROUTES = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: recipes_component_1.RecipesComponent, children: recipes_routes_1.RECIPE_ROUTES },
    { path: 'shopping-list', component: shopping_list_component_1.ShoppingListComponent }
];
exports.routing = router_1.RouterModule.forRoot(APP_ROUTES);
//# sourceMappingURL=../../app/app.routing.js.map