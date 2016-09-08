import { Component }         from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  selector: 'profile',
  directives: [ ROUTER_DIRECTIVES ],
  templateUrl: 'app/components/profile/profile.template.html'
})

export class ProfileComponent {}
