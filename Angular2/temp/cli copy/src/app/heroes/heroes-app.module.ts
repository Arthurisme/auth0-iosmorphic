import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';

import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import './rxjs-extensions';
import { HeroesAppComponent } from './heroes-app.component';
import { heroesAppRouting, routedComponents } from './heroes-app.routing';
import { HeroService } from './hero.service';
import { HeroSearchComponent } from './hero-search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    heroesAppRouting,
    HttpModule
  ],
  declarations: [
    HeroesAppComponent,
    HeroSearchComponent,
    routedComponents
  ],
  providers: [
    HeroService,
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
    { provide: SEED_DATA, useClass: InMemoryDataService }     // in-mem server data
  ],
  bootstrap: [HeroesAppComponent]
})
export class HeroesAppModule { }
