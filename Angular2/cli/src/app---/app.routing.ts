import {
    RouterModule,
    Routes
} from '@angular/router';

import { EmployeeComponent } from './employee/employee.component';
import { EmployeeDetailComponent } from './employee/employee-detail.component';
import { ChatComponent } from './chat/chat.component';
import { WelcomeComponent } from './welcome/welcome.component';

const employeeRoutes: Routes = [
  {
    path: 'employee/:id',
    component: EmployeeComponent,
    children: [
      { path: '', component: EmployeeDetailComponent },
      { path: 'chat', component: ChatComponent, outlet: 'aux' }
    ]
  }
];

const appRoutes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    ...employeeRoutes
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(appRoutes, { useHash: true });