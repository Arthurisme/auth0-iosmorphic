import { bootstrap }                              from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms }   from '@angular/forms';
import { provide }                                from '@angular/core';
import { APP_ROUTER_PROVIDERS }                   from './app.routes';
import { AUTH_PROVIDERS }                         from 'angular2-jwt';
import { AppComponent }                           from './app.component';

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  AUTH_PROVIDERS,
  disableDeprecatedForms(),
  provideForms()
]);
