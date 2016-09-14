"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var recipe_book_component_1 = require("./recipe-book.component");
var header_component_1 = require("./header.component");
var dropdown_directive_1 = require("./dropdown.directive");
var shopping_list_add_component_1 = require("./shopping-list/shopping-list-add.component");
var shopping_list_component_1 = require("./shopping-list/shopping-list.component");
var recipes_component_1 = require("./recipes/recipes.component");
var recipe_list_component_1 = require("./recipes/recipe-list/recipe-list.component");
var recipe_detail_component_1 = require("./recipes/recipe-detail/recipe-detail.component");
var recipe_edit_component_1 = require("./recipes/recipe-edit/recipe-edit.component");
var recipe_item_component_1 = require("./recipes/recipe-list/recipe-item.component");
var recipe_start_component_1 = require("./recipes/recipe-start.component");
var shopping_list_service_1 = require("./shopping-list/shopping-list.service");
var recipe_service_1 = require("./recipes/recipe.service");
var app_routing_1 = require("./app.routing");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                recipe_book_component_1.RecipeBookAppComponent,
                header_component_1.HeaderComponent,
                dropdown_directive_1.DropdownDirective,
                shopping_list_add_component_1.ShoppingListAddComponent,
                shopping_list_component_1.ShoppingListComponent,
                recipes_component_1.RecipesComponent,
                recipe_list_component_1.RecipeListComponent,
                recipe_detail_component_1.RecipeDetailComponent,
                recipe_edit_component_1.RecipeEditComponent,
                recipe_item_component_1.RecipeItemComponent,
                recipe_start_component_1.RecipeStartComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_1.routing
            ],
            providers: [shopping_list_service_1.ShoppingListService, recipe_service_1.RecipeService],
            bootstrap: [recipe_book_component_1.RecipeBookAppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=../../app/app.module.js.map