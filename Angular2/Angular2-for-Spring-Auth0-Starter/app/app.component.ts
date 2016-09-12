import { Component }         from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Auth }              from './auth.service';

import {NavBar} from './components/nav-bar.component';
import {MyAlbum} from './components/my-album.component';

import {ApiTestService} from "./services/apitest.service";
import {HTTP_PROVIDERS} from "@angular/http";

import {RegisterService} from "./services/register.service";
import {LoginService} from "./services/login.service";


import {UserService} from "./services/user.service";
import {PhotoService} from "./services/photo.service";
import {AddPhotoService} from "./services/add-photo.service";
import {UploadPhotoService} from "./services/upload-photo.service";

import {AddPhoto} from "./components/add-photo.component";
import {ImageDetail} from "./components/image-detail.component";

@Component({
    selector: 'my-app',
    providers: [ Auth, HTTP_PROVIDERS,RegisterService,LoginService,UserService,PhotoService,
        AddPhotoService,UploadPhotoService,ApiTestService ],
    directives: [ ROUTER_DIRECTIVES,NavBar,MyAlbum ],
    templateUrl: 'app/app.template.html'
})

export class AppComponent {
  constructor(private auth: Auth) {}
};
