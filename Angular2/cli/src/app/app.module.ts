import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';

import {HttpModule} from '@angular/http';

import {AppComponent} from "./app.component";

import {Auth}              from './auth.service';


import {HomeComponent} from './components/home/home.component';
import {PingComponent} from './components/ping/ping.component';



// import {NavBar} from './photo/nav-bar.component';
// import {MyAlbum} from './photo/my-album.component';
// import {AddPhoto} from './photo/add-photo.component';
// import {ImageDetail} from './photo/image-detail.component';
//
// import {ImageComments} from "./photo/image-comments.component";


// import {UserService} from "./services/user.service";
// import {PhotoService} from "./services/photo.service";
// import {AddPhotoService} from "./services/add-photo.service";
// import {UploadPhotoService} from "./services/upload-photo.service";
// import {ApiTestService} from "./services/apitest.service";
// import {CommentService} from "./services/comment.service";



import {HeaderComponent} from "./components/header/header.component";
import {DropdownDirective} from "./util/dropdown.directive";

import {appRootRouting} from "./app.routing";

// import { HeroesAppModule } from "./heroes/heroes-app.module";
import {ShoppingAppModule} from "./modules/shopping/shopping-app.module";
import {ProfileAppModule} from "./modules/profile/profile-app.module";
import {PhotoAppModule} from "./modules/photo/photo-app.module";


import {AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';
import 'rxjs/add/operator/map';

import {MomentModule} from 'angular2-moment';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        DropdownDirective,

        HomeComponent,
        PingComponent,


        // NavBar,
        // MyAlbum,
        // // AddPhoto,
        // ImageDetail,
        // ImageComments,

    ],
    imports: [
        BrowserModule,
        HttpModule,
        MomentModule,
        appRootRouting,


        // HeroesAppModule,
        ShoppingAppModule,
        ProfileAppModule,
        PhotoAppModule

        // When FromsModule here instead of profile, there are error, why?
        // FormsModule,
    ],
    providers: [
        Auth,
        AuthHttp,

        provideAuth({
            headerName: 'Authorization',
            headerPrefix: 'bearer',
            tokenName: 'token',
            tokenGetter: (() => localStorage.getItem('id_token')),
            globalHeaders: [{'Content-Type': 'application/json'}],
            noJwtError: true
        }),


        // UserService,
        // PhotoService,
        // AddPhotoService,
        // UploadPhotoService,
        // ApiTestService,
        // CommentService


    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
