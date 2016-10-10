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
// import { Auth }              from '../auth.service';
var Auth0_login_service_1 = require("../shared/service/Auth0-login.service");
// import {HeaderComponent} from "../../components/header/header.component";
var config_1 = require("../config/config");
var ProfileShow = (function () {
    function ProfileShow(auth0LoginService) {
        this.auth0LoginService = auth0LoginService;
        this.config = new config_1.Config();
        console.log(this.auth0LoginService.isLoggedIn);
    }
    ProfileShow = __decorate([
        core_1.Component({
            selector: "profile_show",
            // directives: [ ROUTER_DIRECTIVES ],
            // directives: [HeaderComponent],
            templateUrl: "profile/profile_show.template.html"
        }), 
        __metadata('design:paramtypes', [Auth0_login_service_1.Auth0LoginService])
    ], ProfileShow);
    return ProfileShow;
}());
exports.ProfileShow = ProfileShow;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZV9zaG93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGVfc2hvdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUFrQyxlQUFlLENBQUMsQ0FBQTtBQUNsRCx1REFBdUQ7QUFDdkQsb0NBQWdDLHVDQUF1QyxDQUFDLENBQUE7QUFHeEUsNEVBQTRFO0FBRTVFLHVCQUFxQixrQkFBa0IsQ0FBQyxDQUFBO0FBV3hDO0lBSUUscUJBQW9CLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBSHhELFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBSzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFmSDtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixxQ0FBcUM7WUFDckMsaUNBQWlDO1lBRWpDLFdBQVcsRUFBRSxvQ0FBb0M7U0FDbEQsQ0FBQzs7bUJBQUE7SUFVRixrQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksbUJBQVcsY0FRdkIsQ0FBQTtBQUFBLENBQUMifQ==