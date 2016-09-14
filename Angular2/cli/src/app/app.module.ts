import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";

import { HeaderComponent } from "./components/header/header.component";
import { DropdownDirective } from "./util/dropdown.directive";
// import { ShoppingListAddComponent } from "./shopping-list/shopping-list-add.component";
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RecipesComponent } from "./recipes/recipes.component";
// import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
// import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
// import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
// import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item.component";
// import { RecipeStartComponent } from "./recipes/recipe-start.component";
// import { ShoppingListService } from "./shopping-list/shopping-list.service";
// import { RecipeService } from "./recipes/recipe.service";
import { routing } from "./app.routing";

import { HeroesAppModule } from "./heroes/heroes-app.module";
import { ShoppingAppModule } from "./shopping/shopping-app.module";




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    // ShoppingListAddComponent,
    // ShoppingListComponent,
    // RecipesComponent,
    // RecipeListComponent,
    // RecipeDetailComponent,
    // RecipeEditComponent,
    // RecipeItemComponent,
    // RecipeStartComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HeroesAppModule,
    ShoppingAppModule
  ],
  providers: [
    //   ShoppingListService,
    // RecipeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
