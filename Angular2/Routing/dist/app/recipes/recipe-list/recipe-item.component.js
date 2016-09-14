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
var recipe_1 = require('../recipe');
var RecipeItemComponent = (function () {
    function RecipeItemComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', recipe_1.Recipe)
    ], RecipeItemComponent.prototype, "recipe", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RecipeItemComponent.prototype, "recipeId", void 0);
    RecipeItemComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'rb-recipe-item',
            templateUrl: 'recipe-item.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], RecipeItemComponent);
    return RecipeItemComponent;
}());
exports.RecipeItemComponent = RecipeItemComponent;
//# sourceMappingURL=../../../../app/recipes/recipe-list/recipe-item.component.js.map