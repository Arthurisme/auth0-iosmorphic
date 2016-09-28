

//Not all the file in the shared directory are in shared.module!

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }         from '@angular/forms';

import { AwesomePipe }         from './pipe/awesome.pipe';
import { HighlightDirective }  from './directive/highlight.directive';


import {MyCustomComponent} from "./components/my-custom/my-custom.component";
// import {HeaderComponent} from "./header.component";
// import {CoreModule} from "../core/core.module";

import {DropdownDirective} from "../core/dropdown.directive";
import {NavigateService} from "./service/navigate.service";
import {Auth0LoginService} from "./service/Auth0-login.service";




@NgModule({

  providers: [
    NavigateService,
    Auth0LoginService,
  ],

  imports:      [
    CommonModule,
    RouterModule,
    // CoreModule

  ],
  declarations: [



    AwesomePipe,
    HighlightDirective,
    DropdownDirective,

    // HeaderComponent,
    MyCustomComponent,



  ],
  exports:      [


    AwesomePipe,
    HighlightDirective,
    CommonModule,
    RouterModule,
    // CoreModule,
    FormsModule,

    // HeaderComponent,
    MyCustomComponent,

    // Config,





  ]
})
export class SharedModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
