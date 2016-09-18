"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var auth_service_1 = require('../../auth.service');
var user_service_1 = require("../../services/user.service");
var HomeComponent = (function () {
    function HomeComponent(auth, userService) {
        this.auth = auth;
        this.userService = userService;
    }
    HomeComponent.prototype.binding = function () {
        console.log("binding clicked on home.component");
        this.userService.bindingUserToSpring().subscribe();
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            template: "\n    <h4 *ngIf=\"auth.authenticated()\">You are logged in</h4>\n    <h4 *ngIf=\"!auth.authenticated()\">You are not logged in, please click 'Log in' button to login</h4>\n        <button (click)=\"binding()\">test binding Auth0 profile user to spring databese User </button>\n\n  "
        }), 
        __metadata('design:paramtypes', [auth_service_1.Auth, user_service_1.UserService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
;
//# sourceMappingURL=home.component.js.map