import { RouterModule, Routes } from '@angular/router';


import {HomeComponent} from './components/home/home.component'
import {PingComponent} from './components/ping/ping.component'
// import {ProfileRoutes} from "./modules/profile/profile.routes";
// import {ProfileComponent} from "./components/profile/profile.component";
// import {ProfileShow} from "./components/profile/profile_show.component";
// import {AddPhoto} from "./photo/add-photo.component";
// import {ImageDetail} from "./photo/image-detail.component";
// import {MyAlbum} from "./photo/my-album.component";

const appRootRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},

  // {path: 'profile', component: ProfileComponent},
  // {path: 'profile/show', component: ProfileShow},
  // {path: 'profile', component: ProfileRoutes},
  // {path:'my-album' ,component:MyAlbum},
  // {path:'image-detail/:id' , component: ImageDetail},
  // {path:'add-photo', component:AddPhoto},


    //each module has it's own routes and not from here.(from appMudule automatically)
    //from component:
  {path: 'home', component: HomeComponent},
  {path: 'ping', component: PingComponent},
  // { path: '**', redirectTo: '' }


];

export const appRootRouting = RouterModule.forRoot(appRootRoutes);
