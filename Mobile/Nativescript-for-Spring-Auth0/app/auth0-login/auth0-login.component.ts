import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";


var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
import {Auth0LoginService} from "../shared/service/Auth0-login.service";
import {NavigateService} from "../shared/service/navigate.service";


// import {Page} from "ui/page";
// import {alert, setHintColor, LoginService, User} from "../shared";


@Component({
    selector: "my-auth0-login",
    templateUrl: "auth0-login/auth0-login.component.html",
    styleUrls: ["auth0-login/auth0-login-common.css", "auth0-login/auth0-login.component.css"],
})
export class Auth0LoginComponent {

    currentToken:string;


    constructor(private router:Router,
                private navigateService:NavigateService,
    private auth0LoginService:Auth0LoginService) {


        if (!this.auth0LoginService.isLoggedIn) {
            this.doLogin();
        }
        else {
            this.gotonextpage()
        }



    }


    public doLogin() {

        //login with service.
        this.auth0LoginService.loginAndTo("/ping");
        //or: this.auth0LoginService.login ();

    }

    doLogout() {

        console.log("Test doLogout function begin");


        if (this.auth0LoginService.isLoggedIn) {
            appSettings.remove("auth0Token");
            appSettings.remove("auth0UserData");        }


        this.router.navigate(["/ping"]);

        console.log("Test doLogout function fini");

    }

    gotonextpage() {

        //To do: Move the nexpage string to config
        this.router.navigate(["/ping"]);
    }

    goToHome() {
        this.router.navigate(["/"]);

    }

    public showToken() {
        //To do: Move the nexpage string to config
        this.currentToken = appSettings.getString("auth0Token");
        console.log(this.currentToken);
        console.log("Test console function");
    }

    test1() {

    }

    test2() {
        this.test1();
        this.gotonextpage();
    }
}
