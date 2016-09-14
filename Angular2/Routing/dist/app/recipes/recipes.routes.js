"use strict";
var recipe_start_component_1 = require("./recipe-start.component");
var recipe_detail_component_1 = require("./recipe-detail/recipe-detail.component");
var recipe_edit_1 = require("./recipe-edit");
exports.RECIPE_ROUTES = [
    { path: '', component: recipe_start_component_1.RecipeStartComponent },
    { path: 'new', component: recipe_edit_1.RecipeEditComponent },
    { path: ':id', component: recipe_detail_component_1.RecipeDetailComponent },
    { path: ':id/edit', component: recipe_edit_1.RecipeEditComponent }
];
//# sourceMappingURL=../../../app/recipes/recipes.routes.js.map