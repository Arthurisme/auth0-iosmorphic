import { Component }         from '@angular/core';
import { Auth }              from '../auth.service';
import { Router } from '@angular/router';
// import {HeaderComponent} from "../../components/header/header.component";


@Component({
  selector: 'profile_show',
  // directives: [ ROUTER_DIRECTIVES ],
  // directives: [HeaderComponent],

  templateUrl: 'profile_show.template.html'
})

export class ProfileShow {
  constructor(private auth: Auth) {}
};
