

import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

/* App Root */
import { AppComponent }   from './app.component';

import {SharedModule} from "./shared/shared.module";


/* Feature Modules */
import { ContactModule }  from './contact/contact.module';
import { CoreModule }     from './core/core.module';
import {routing, appRoutingProviders}        from './app.routing';
import {HttpModule} from "@angular/http";

import {Auth}              from './auth.service';
import {AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';


// import {HeaderComponent} from "./shared/header.component";

import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { RecipeService } from "./recipes/recipe.service";




import {PhotoAppModule} from "./photo/photo-app.module";
import {ProfileAppModule} from "./profile/profile-app.module";
import {PingModule} from "./ping/ping.module";





@NgModule({
  imports: [
    BrowserModule,
    HttpModule,

    ContactModule,

     CoreModule,

    CoreModule.forRoot({userName: 'Miss Marple'}),
    routing,


    SharedModule,


    ProfileAppModule,
    PingModule,


    PhotoAppModule


  ],
  declarations: [
    AppComponent,
    // HeaderComponent,
  ],
  providers: [
    appRoutingProviders,
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


    ShoppingListService,
    RecipeService
  ],
  bootstrap:    [AppComponent]
})
export class AppModule { }


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */




//Original download from official site
// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
//
// import { AppComponent } from './app.component';
//
// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     HttpModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
