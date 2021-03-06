import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }         from '@angular/forms';

import { AwesomePipe }         from './awesome.pipe';
import { HighlightDirective }  from './highlight.directive';


import {MyCustomComponent} from "./my-custom.component";
import {HeaderComponent} from "./header.component";
// import {CoreModule} from "../core/core.module";
import {DropdownDirective} from "../core/dropdown.directive";




@NgModule({
  imports:      [
    CommonModule,
    RouterModule,
    // CoreModule

  ],
  declarations: [



    AwesomePipe,
    HighlightDirective,
    DropdownDirective,

    HeaderComponent,
    MyCustomComponent,
  ],
  exports:      [


    AwesomePipe,
    HighlightDirective,
    CommonModule,
    RouterModule,
    // CoreModule,
    FormsModule,

    HeaderComponent,
    MyCustomComponent,

  ]
})
export class SharedModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
