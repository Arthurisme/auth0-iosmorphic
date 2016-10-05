import { Component }         from '@angular/core';
// import { Auth }              from '../auth.service';
import {Auth0LoginService} from "../shared/service/Auth0-login.service";

import { Router } from '@angular/router';
// import {HeaderComponent} from "../../components/header/header.component";

import {Config} from "../config/config";


@Component({
  selector: "profile_show",
  // directives: [ ROUTER_DIRECTIVES ],
  // directives: [HeaderComponent],

  templateUrl: "profile/profile_show.template.html"
})

export class ProfileShow {
  config: Config = new Config();


  constructor(private auth0LoginService: Auth0LoginService) {

    console.log(this.auth0LoginService.isLoggedIn);
  }
};
