import { RouterModule, Routes } from '@angular/router';

// import { RecipesComponent } from "./recipes/recipes.component";
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RECIPE_ROUTES } from "./recipes/recipes.routes";
import {ModuleWithProviders} from "@angular/core";
import {ImageDetail} from "./image-detail/image-detail.component";
import {MyAlbum} from "./my-album/my-album.component";
import {AddPhoto} from "./add-photo/add-photo.component";
import {PhotoHomeComponent} from "./photo-home/photo-home.component";

const photoAppRoutes: Routes = [
  // {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},
  // {path: 'shopping-list', component: ShoppingListComponent}

  {path:'photos-home' ,component:PhotoHomeComponent},
  {path:'my-album' ,component:MyAlbum},
  {path:'image-detail/:id' , component: ImageDetail},
  {path:'add-photo', component:AddPhoto},
];

export const photoAppRouting:ModuleWithProviders  = RouterModule.forChild(photoAppRoutes);
