import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { AwesomePipe }         from './awesome.pipe';
import { HighlightDirective }  from './highlight.directive';


import {Header2Component} from "./header2.component";




@NgModule({
  imports:      [ CommonModule ],
  declarations: [

    Header2Component,

    AwesomePipe,
    HighlightDirective
  ],
  exports:      [

    Header2Component,

    AwesomePipe,
    HighlightDirective,
    CommonModule,
    FormsModule ]
})
export class SharedModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
