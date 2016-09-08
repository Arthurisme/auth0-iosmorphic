import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent }               from './components/home/home.component';
import { PingComponent }               from './components/ping/ping.component';
import {ProfileRoutes}                 from "./components/profile/profile.routes";

export const routes: RouterConfig = [
  { path: '', component: HomeComponent},
  { path: 'ping', component: PingComponent},
  ...ProfileRoutes,
  { path: '**', redirectTo: '' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
