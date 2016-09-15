import { Component }         from '@angular/core';
import { Auth }              from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'profile_show',
  // directives: [ ROUTER_DIRECTIVES ],
  templateUrl: 'profile_show.template.html'
})

export class ProfileShow {
  constructor(private auth: Auth) {}
};
