import { NgModule }           from '@angular/core';
import { SharedModule }       from '../shared/shared.module';

import { PingComponent }   from './ping.component';
 import { pingRouting }            from './ping.routing';

@NgModule({
  imports:      [ SharedModule, pingRouting ],
  declarations: [ PingComponent ],
  providers:    [   ]
})
export class PingModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
