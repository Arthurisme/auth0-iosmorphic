import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import {
    routing,
    appRoutingProviders
} from './app.routing';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        routing
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        appRoutingProviders
    ]
})
export class AppModule { }