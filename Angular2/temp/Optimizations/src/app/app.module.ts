import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { RecipeBookAppComponent } from "./recipe-book.component";
import { HeaderComponent } from "./header.component";
import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { RecipeService } from "./recipes/recipe.service";
import { routing } from "./app.routing";
import { CoreModule } from "./core.module";

@NgModule({
    declarations: [
        RecipeBookAppComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        routing,
        CoreModule
    ],
    providers: [ShoppingListService, RecipeService],
    bootstrap: [RecipeBookAppComponent]
})
export class AppModule {
}
