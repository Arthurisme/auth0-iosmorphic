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
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require('@angular/core');
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
var profile_component_1 = require("./profile.component");
var profile_show_component_1 = require("./profile_show.component");
var profile_edit_component_1 = require("./profile_edit.component");
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RecipesComponent } from "./recipes/recipes.component";
// import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
// import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
// import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
// import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item.component";
// import { RecipeStartComponent } from "./recipes/recipe-start.component";
// import { ShoppingListService } from "./shopping-list/shopping-list.service";
// import { RecipeService } from "./recipes/recipe.service";
var profile_routing_1 = require("./profile.routing");
var shared_module_1 = require("../shared/shared.module");
// import {HeaderComponent} from "../../components/header/header.component";
var ProfileModule = (function () {
    function ProfileModule() {
    }
    ProfileModule = __decorate([
        core_1.NgModule({
            // schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            declarations: [
                // HeaderComponent,
                // ShoppingListAddComponent,
                // ShoppingListComponent,
                // RecipesComponent,
                // RecipeListComponent,
                // RecipeDetailComponent,
                // RecipeEditComponent,
                // RecipeItemComponent,
                // RecipeStartComponent
                profile_component_1.ProfileComponent,
                profile_show_component_1.ProfileShow,
                profile_edit_component_1.ProfileEdit
            ],
            imports: [
                shared_module_1.SharedModule,
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                // NativeScriptHttpModule,
                // NativeScriptRouterModule.forChild(profileRoutes),
                profile_routing_1.profileRouting,
            ],
            providers: [],
            // exports: [        HeaderComponent,],
            bootstrap: []
        }), 
        __metadata('design:paramtypes', [])
    ], ProfileModule);
    return ProfileModule;
}());
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUsc0JBQXdDLDRCQUE0QixDQUFDLENBQUE7QUFNckUscUJBQStDLGVBQWUsQ0FBQyxDQUFBO0FBQy9ELDZEQUE2RDtBQUM3RCxnREFBZ0Q7QUFJaEQsa0NBQWlDLHFCQUFxQixDQUFDLENBQUE7QUFDdkQsdUNBQTRCLDBCQUEwQixDQUFDLENBQUE7QUFDdkQsdUNBQTRCLDBCQUEwQixDQUFDLENBQUE7QUFDdkQsbUZBQW1GO0FBQ25GLGtFQUFrRTtBQUNsRSxxRkFBcUY7QUFDckYsMkZBQTJGO0FBQzNGLHFGQUFxRjtBQUNyRixxRkFBcUY7QUFDckYsMkVBQTJFO0FBQzNFLCtFQUErRTtBQUMvRSw0REFBNEQ7QUFDNUQsZ0NBQThCLG1CQUFtQixDQUFDLENBQUE7QUFDbEQsOEJBQTJCLHlCQUF5QixDQUFDLENBQUE7QUFFckQsNEVBQTRFO0FBb0Q1RTtJQUFBO0lBQTRCLENBQUM7SUE5QzdCO1FBQUMsZUFBUSxDQUFDO1lBRVIsdUNBQXVDO1lBRXZDLFlBQVksRUFBRTtnQkFDWixtQkFBbUI7Z0JBRW5CLDRCQUE0QjtnQkFDNUIseUJBQXlCO2dCQUN6QixvQkFBb0I7Z0JBQ3BCLHVCQUF1QjtnQkFDdkIseUJBQXlCO2dCQUN6Qix1QkFBdUI7Z0JBQ3ZCLHVCQUF1QjtnQkFDdkIsdUJBQXVCO2dCQUN2QixvQ0FBZ0I7Z0JBQ2hCLG9DQUFXO2dCQUNYLG9DQUFXO2FBQ1o7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsNEJBQVk7Z0JBRVosNkJBQWtCO2dCQUNsQiwrQkFBdUI7Z0JBRXZCLDBCQUEwQjtnQkFDMUIsb0RBQW9EO2dCQUNwRCxnQ0FBYzthQVFmO1lBQ0QsU0FBUyxFQUFFLEVBR1Y7WUFDRCx1Q0FBdUM7WUFDdkMsU0FBUyxFQUFFLEVBR1Y7U0FDRixDQUFDOztxQkFBQTtJQUMwQixvQkFBQztBQUFELENBQUMsQUFBN0IsSUFBNkI7QUFBaEIscUJBQWEsZ0JBQUcsQ0FBQSJ9