import { Component } from '@angular/core';
import { Auth }      from '../../auth.service';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'home',
  template: `
    <h4 *ngIf="auth.authenticated()">You are logged in</h4>
    <h4 *ngIf="!auth.authenticated()">You are not logged in, please click 'Log in' button to login</h4>
        <button (click)="binding()">test binding Auth0 profile user to spring databese User </button>

  `
})

export class HomeComponent {
  constructor(private auth: Auth,   private userService:UserService
  ) {}



  binding(){
   console.log("binding clicked on home.component");

    this.userService.bindingUserToSpring().subscribe();
  }



};
