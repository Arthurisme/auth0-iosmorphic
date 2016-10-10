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
"use strict";
var profile_edit_component_1 = require('./profile_edit.component');
var profile_show_component_1 = require('./profile_show.component');
var profile_component_1 = require('./profile.component');
var router_1 = require("nativescript-angular/router");
exports.profileRoutes = [
    {
        path: 'profile',
        component: profile_component_1.ProfileComponent,
        // pathMatch: "full"
        children: [
            { path: 'edit', component: profile_edit_component_1.ProfileEdit },
            { path: '', component: profile_show_component_1.ProfileShow }
        ]
    }
];
exports.profileRouting = router_1.NativeScriptRouterModule.forRoot(exports.profileRoutes);
// export const profileRouting:ModuleWithProviders  =  RouterModule.forRoot(profileRoutes);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5yb3V0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZmlsZS5yb3V0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBEQUEwRDtBQUMxRCxFQUFFO0FBQ0Ysa0VBQWtFO0FBQ2xFLG1GQUFtRjtBQUNuRiw0REFBNEQ7QUFDNUQscURBQXFEO0FBQ3JELEVBQUU7QUFDRixzQ0FBc0M7QUFDdEMsOERBQThEO0FBQzlELDZFQUE2RTtBQUM3RSw4REFBOEQ7QUFDOUQsS0FBSztBQUNMLEVBQUU7QUFDRixtR0FBbUc7O0FBTW5HLHVDQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELHVDQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELGtDQUFpQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRXZELHVCQUF1Qyw2QkFBNkIsQ0FBQyxDQUFBO0FBRXhELHFCQUFhLEdBQVc7SUFDbkM7UUFDRSxJQUFJLEVBQUUsU0FBUztRQUNmLFNBQVMsRUFBRSxvQ0FBZ0I7UUFDM0Isb0JBQW9CO1FBQ3BCLFFBQVEsRUFBRTtZQUNSLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRyxTQUFTLEVBQUUsb0NBQVcsRUFBRTtZQUN6QyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQU0sU0FBUyxFQUFFLG9DQUFXLEVBQUU7U0FDekM7S0FDRjtDQUNGLENBQUM7QUFFVyxzQkFBYyxHQUF3QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMscUJBQWEsQ0FBQyxDQUFDO0FBQ25HLDJGQUEyRiJ9