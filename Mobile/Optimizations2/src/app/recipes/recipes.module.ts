import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { RecipeStartComponent } from "./recipe-start.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { recipesRouting } from "./recipes.routing";
import { RecipesComponent } from "./recipes.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeStartComponent,
        RecipeItemComponent,
        RecipeEditComponent,
        RecipeDetailComponent
    ],
    imports: [SharedModule, ReactiveFormsModule, recipesRouting]
})
export class RecipesModule {}