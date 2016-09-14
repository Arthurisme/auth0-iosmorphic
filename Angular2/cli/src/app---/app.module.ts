import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
// import { AppComponent } from './heroes/app.component';

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import {
    routing,
    appRoutingProviders
} from './app.routing';





@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
