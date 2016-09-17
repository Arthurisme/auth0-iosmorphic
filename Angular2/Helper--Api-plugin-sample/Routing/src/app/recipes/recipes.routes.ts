import { RouterConfig } from "@angular/router";

import { RecipeStartComponent } from "./recipe-start.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit";

export const RECIPE_ROUTES: RouterConfig = [
  { path: '', component: RecipeStartComponent },
  { path: 'new', component: RecipeEditComponent },
  { path: ':id', component: RecipeDetailComponent },
  { path: ':id/edit', component: RecipeEditComponent }
];
