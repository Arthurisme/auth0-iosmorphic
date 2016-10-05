import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { LoginService } from "../shared";
import {Auth0LoginService} from "../shared/service/Auth0-login.service";

@Injectable()
export class AuthGuardGroceries implements CanActivate {
  constructor(
      private router: Router,
      private loginService: LoginService,
      private auth0LoginService:Auth0LoginService
  ) { }

  canActivate() {
    if (this.loginService.isLoggedIn) {
      return true;
    }
    else {
      this.router.navigate(["/login"]);
      return false;
    }
  }


}

