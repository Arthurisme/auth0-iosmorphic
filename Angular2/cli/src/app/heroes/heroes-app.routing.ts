import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import {ModuleWithProviders} from "@angular/core";

const heroesappRoutes: Routes = [
  {
    path: 'heroesdb',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'heroesdashboard',
    component: DashboardComponent
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  },
  {
    path: 'heroes',
    component: HeroesComponent
  }
];

export const heroesappRouting:ModuleWithProviders = RouterModule.forChild(heroesappRoutes);

export const routedComponents = [DashboardComponent, HeroesComponent, HeroDetailComponent];
