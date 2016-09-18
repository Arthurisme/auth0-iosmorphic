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
"use strict";
var core_1 = require("@angular/core");
// import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            // directives: [NS_ROUTER_DIRECTIVES],
            template: "<page-router-outlet></page-router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map