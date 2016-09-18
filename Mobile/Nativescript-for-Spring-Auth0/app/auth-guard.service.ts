import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { LoginService } from "./shared";
import {Auth0LoginService} from "./shared/Auth0-login.service";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth0LoginService:Auth0LoginService) { }

  canActivate() {
    if (this.auth0LoginService.isLoggedIn) {
      return true;
    }
    else {
      this.router.navigate(["/auth0login"]);
      return false;
    }
  }
}

