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


import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

/* App Root */
import { AppComponent }   from './app.component';

/* Feature Modules */
import { ContactModule }  from './contact/contact.module';
import { CoreModule }     from './core/core.module';
import { routing }        from './app.routing';
import {HeaderComponent} from "./header.component";
import {HttpModule} from "@angular/http";



import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { RecipeService } from "./recipes/recipe.service";




@NgModule({
  imports: [
    BrowserModule,
    HttpModule,

    ContactModule,
    /*
     CoreModule,
     */
    CoreModule.forRoot({userName: 'Miss Marple'}),
    routing
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  providers: [ShoppingListService, RecipeService],
  bootstrap:    [AppComponent]
})
export class AppModule { }


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
