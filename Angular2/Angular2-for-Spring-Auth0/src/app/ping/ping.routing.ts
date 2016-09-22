import { ModuleWithProviders } from '@angular/core';
import {RouterModule, Routes}        from '@angular/router';

import { PingComponent }    from './ping.component';



const PING_ROUTES: Routes = [
  { path: 'ping', component: PingComponent}
];

export const pingRouting: ModuleWithProviders = RouterModule.forChild(PING_ROUTES);


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
