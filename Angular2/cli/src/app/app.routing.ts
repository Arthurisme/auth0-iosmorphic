import { RouterModule, Routes } from '@angular/router';


import {HomeComponent} from './components/home/home.component'
import {PingComponent} from './components/ping/ping.component'
import {ProfileRoutes} from "./components/profile/profile.routes";
import {AddPhoto} from "./photo/add-photo.component";
import {ImageDetail} from "./photo/image-detail.component";
import {MyAlbum} from "./photo/my-album.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},
  {path: 'home', component: HomeComponent},
  {path: 'ping', component: PingComponent},
  // {path: 'profile', component: ProfileRoutes},
  // {path:'my-album' ,component:MyAlbum},
  // {path:'image-detail/:id' , component: ImageDetail},
  // {path:'add-photo', component:AddPhoto},
  // { path: '**', redirectTo: '' }


];

export const routing = RouterModule.forRoot(APP_ROUTES);
