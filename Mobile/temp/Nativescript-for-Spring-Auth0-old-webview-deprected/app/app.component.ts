// import {Component} from "@angular/core";
//
// @Component({
//     selector: "my-app",
//     templateUrl: "app.component.html",
// })
// export class AppComponent {
//     public counter: number = 16;
//
//     public get message(): string {
//         if (this.counter > 0) {
//             return this.counter + " taps left";
//         } else {
//             return "Hoorraaay! \nYou are ready to start building!";
//         }
//     }
//
//     public onTap() {
//         this.counter--;
//     }
// }



import { Component } from "@angular/core";
// import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";

@Component({
    selector: "my-app",
    // directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "./app.component.html",
})
export class AppComponent { }