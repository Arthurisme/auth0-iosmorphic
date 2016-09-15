import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from "./app.component";

import { Auth }              from './auth.service';

import { AuthHttp  }  from 'angular2-jwt';

import {HomeComponent} from './components/home/home.component'
import {PingComponent} from './components/ping/ping.component'
// import {ProfileRoutes} from "./components/profile/profile.routes";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileShow} from "./components/profile/profile_show.component";
import {ProfileEdit} from "./components/profile/profile_edit.component";

import {NavBar} from './photo/nav-bar.component';
import {MyAlbum} from './photo/my-album.component';
// import {ImageComments} from "./photo/image-comments.component";


import {UserService} from "./services/user.service";
import {PhotoService} from "./services/photo.service";
import {AddPhotoService} from "./services/add-photo.service";
import {UploadPhotoService} from "./services/upload-photo.service";
import {ApiTestService} from "./services/apitest.service";



import { HeaderComponent } from "./components/header/header.component";
import { DropdownDirective } from "./util/dropdown.directive";

import { routing } from "./app.routing";

// import { HeroesAppModule } from "./heroes/heroes-app.module";
import { ShoppingAppModule } from "./shopping/shopping-app.module";


import 'rxjs/add/operator/map';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,

    HomeComponent,
    PingComponent,
    // ProfileRoutes,
    // ProfileComponent,
    // ProfileShow,
    // ProfileEdit,

    NavBar,
    MyAlbum,
    // ImageComments,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing,





    // HeroesAppModule,
    ShoppingAppModule
  ],
  providers: [
      Auth,
    AuthHttp,


    UserService,
    PhotoService,
    AddPhotoService,
    UploadPhotoService,
    ApiTestService


  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
