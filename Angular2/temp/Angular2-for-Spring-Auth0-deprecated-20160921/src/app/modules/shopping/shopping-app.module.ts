import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { ShoppingListAddComponent } from "./shopping-list/shopping-list-add.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item.component";
import { RecipeStartComponent } from "./recipes/recipe-start.component";
import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { RecipeService } from "./recipes/recipe.service";
import { shoppingAppRouting } from "./shopping-app.routing";


import {HeaderComponent} from "../../components/header/header.component";





@NgModule({
  declarations: [

    // HeaderComponent,

    ShoppingListAddComponent,
    ShoppingListComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeStartComponent
  ],
  imports: [
    BrowserModule,
    shoppingAppRouting,
  ],
  providers: [ShoppingListService, RecipeService],
  // exports: [        HeaderComponent,],


  bootstrap: [RecipesComponent]
})
export class ShoppingAppModule {}
