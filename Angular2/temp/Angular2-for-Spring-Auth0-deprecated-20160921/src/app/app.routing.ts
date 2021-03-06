import { RouterModule, Routes } from '@angular/router';


import {HomeComponent} from './components/home/home.component'
import {PingComponent} from './components/ping/ping.component'
import {ErrorComponent} from "./components/error/error.component";

// import {AddPhoto} from "./modules/photo/add-photo.component";
// import {ImageDetail} from "./modules/photo/image-detail/image-detail.component";
// import {MyAlbum} from "./modules/photo/my-album/my-album.component";

const appRootRoutes: Routes = [
    // homepage set to:
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},

  // {path:'my-album' ,component:MyAlbum},
  // {path:'image-detail/:id' , component: ImageDetail},
  // {path:'add-photo', component:AddPhoto},


    //each module has it's own routes and not from here.(from appMudule automatically)
    //from component:
  {path: 'home', component: HomeComponent},
  {path: 'ping', component: PingComponent},
  // { path: '/**', component: ErrorComponent },

  // { path: '**', redirectTo: '' }


];

export const appRootRouting = RouterModule.forRoot(appRootRoutes);
