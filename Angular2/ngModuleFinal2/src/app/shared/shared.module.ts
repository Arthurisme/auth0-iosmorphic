import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }         from '@angular/forms';

import { AwesomePipe }         from './awesome.pipe';
import { HighlightDirective }  from './highlight.directive';


import {MyCustomComponent} from "./my-custom.component";
import {HeaderComponent} from "./header.component";




@NgModule({
  imports:      [
    CommonModule,
    RouterModule,

  ],
  declarations: [



    AwesomePipe,
    HighlightDirective,

    HeaderComponent,
    MyCustomComponent,
  ],
  exports:      [


    AwesomePipe,
    HighlightDirective,
    CommonModule,
    RouterModule,
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
