import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent }               from './components/home/home.component';
import { PingComponent }               from './components/ping/ping.component';
import {ProfileRoutes}                 from "./components/profile/profile.routes";
import {AddPhoto} from "./components/add-photo.component";
import {ImageDetail} from "./components/image-detail.component";
import {MyAlbum} from "./components/my-album.component";

export const routes: RouterConfig = [
  { path: '', component: HomeComponent},

  {path:'my-album' ,component:MyAlbum},
  {path:'image-detail/:id' , component: ImageDetail},
  {path:'add-photo', component:AddPhoto},


  { path: 'ping', component: PingComponent},
  ...ProfileRoutes,
  { path: '**', redirectTo: '' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
