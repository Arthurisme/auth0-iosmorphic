// import { RouterModule, Routes } from '@angular/router';
//
// import { RecipesComponent } from "./recipes/recipes.component";
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RECIPE_ROUTES } from "./recipes/recipes.routes";
// import {ModuleWithProviders} from "@angular/core";
//
// const shoppingAppRoutes: Routes = [
//   // {path: '', redirectTo: '/recipes', pathMatch: 'full'},
//   {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},
//   {path: 'shopping-list', component: ShoppingListComponent}
// ];
//
// export const shoppingAppRouting:ModuleWithProviders  = RouterModule.forChild(shoppingAppRoutes);

/////////

import { RouterModule, Routes } from '@angular/router';
import { ProfileEdit }      from './profile_edit.component';
import { ProfileShow }      from './profile_show.component';
import { ProfileComponent } from './profile.component';
import {ModuleWithProviders} from "@angular/core";

export const profileRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'edit',  component: ProfileEdit },
      { path: '',     component: ProfileShow }
    ]
  }
];

export const profileAppRouting:ModuleWithProviders  = RouterModule.forChild(profileRoutes);

