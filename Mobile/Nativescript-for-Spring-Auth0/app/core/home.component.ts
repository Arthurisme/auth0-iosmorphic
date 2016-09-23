// import { Component, OnInit } from '@angular/core';
//
// import { Auth }      from '../auth.service';
// import {UserService} from "../services/user.service";
//
// @Component({
//   selector: 'app-home',
//   template: `
//     <h1>Welcome to the Auth0-Iosmorphic  </h1>
//         <h4 *ngIf="auth.authenticated()">You are logged in</h4>
//     <h4 *ngIf="!auth.authenticated()">You are not logged in, please click 'Log in' button to login</h4>
//         <button (click)="binding()">test binding Auth0 profile user to spring databese User </button>
//   `,
//   styles: []
// })
// export class HomeComponent implements OnInit {
//
//   constructor(private auth: Auth,   private userService:UserService) { }
//
//   ngOnInit() {
//   }
//
//   binding(){
//     console.log("binding clicked on home.component");
//
//     this.userService.bindingUserToSpring().subscribe();
//   }
//
//
// }
