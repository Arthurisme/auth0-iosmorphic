import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';



import {  ProfileComponent} from "./profile.component";
import {  ProfileShow} from "./profile_show.component";
import {  ProfileEdit} from "./profile_edit.component";
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RecipesComponent } from "./recipes/recipes.component";
// import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
// import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
// import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
// import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item.component";
// import { RecipeStartComponent } from "./recipes/recipe-start.component";
// import { ShoppingListService } from "./shopping-list/shopping-list.service";
// import { RecipeService } from "./recipes/recipe.service";
import { profileAppRouting } from "./profile-app.routing";
import {SharedModule} from "../shared/shared.module";
// import {HeaderComponent} from "../../components/header/header.component";





@NgModule({

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
    ProfileComponent,
    ProfileShow,
    ProfileEdit
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    // shoppingAppRouting,
    profileAppRouting
  ],
  providers: [
    //   ShoppingListService,
    // RecipeService
  ],
  // exports: [        HeaderComponent,],
  bootstrap: [
      // RecipesComponent
  ]
})
export class ProfileAppModule {}
