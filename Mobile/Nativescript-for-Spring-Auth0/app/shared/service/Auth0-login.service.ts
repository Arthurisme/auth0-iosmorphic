import {Injectable} from "@angular/core";


import {Router} from "@angular/router";


import {alert, setHintColor, LoginService} from "../";
var auth0 = require("nativescript-auth0");
import * as appSettings from "application-settings";

var application = require("application");
import {Page} from "ui/page";
import {User} from "../model/groceries-user.model";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Config} from "../../config/config";


const tokenKey = "auth0Token";

@Injectable()
export class Auth0LoginService {

    config:Config = new Config();
    profileJson:any;
    idToken:string;


    constructor(private router:Router
                // private backend: BackendService
    ) {

        if (this.isLoggedIn) {
            this.profileJson = JSON.parse(this.profileFromLocalStorage);
            this.idToken = this.idTokenFromLocalStorage;
        }


    }


    get isLoggedIn():boolean {

        // Check to see if the user is logged in
        if (!appSettings.hasKey(this.config.auth0TokenName)) {
            console.log("no token stored.");

            //if no token stored: go to login:
            // this.doLogin();
            return false;

        } else {
            console.log("has token stored");


            //Test if token and profile is saved:
            var tokenData = this.auth0TokenFromLocalStorage;
            console.log("Token stored @isLoggedIn is:");
            console.log(tokenData);
            var profileData = JSON.parse(this.profileFromLocalStorage);
            console.log("User profile stored @isLoggedIn is:");
            console.log(profileData);
            console.log("User profile name stored @isLoggedIn is:");
            console.log(profileData.name);


            //Check if it's expired : go to login:
            // if(auth0.isTokenExpired(tokenData.token.idToken)){
            if (auth0.isTokenExpired(this.token)) {
                //Make them log in again
                console.log("token expired, login again.");

                // this.doLogin();
                return false;
            } else {
                //All good, navigate to your start page
                console.log("has token stored, go to next page");

                // this.gotonextpage();
                return true;
            }
        }


        // return !!getString(tokenKey);
    }


    private get token():string {
        return appSettings.getString(this.config.auth0TokenName);
    }

    private set token(theToken:string) {
        appSettings.setString(this.config.auth0TokenName, theToken);
    }

    private get auth0TokenFromLocalStorage():string {
        return appSettings.getString(this.config.auth0TokenName);
    }

    private get idTokenFromLocalStorage():string {
        return JSON.parse(appSettings.getString(this.config.auth0TokenName)).idToken;
    }

    private get profileFromLocalStorage():string {
        return appSettings.getString(this.config.auth0ProfileName);
    }





    //This is for standard login, which lead a navigater to "/ping"
    login() {
        let afterLoginPageUri = "/ping";

        if (this.isLoggedIn) {
            this.router.navigate([afterLoginPageUri]);
        }
        else {

            console.log("Starting processing of login...");

            auth0.show().then((args) => {
                console.log(args.profile);
                console.log(args.token);
                // appSettings.setString("auth0Token", JSON.stringify(args));

                let afterLoginPageUri = "/ping";
                this.router.navigate([afterLoginPageUri]);

                console.log("login ok point 1 !");

            }, (error) => {
                alert(error);
            });

            console.log("login ok point a2 !");
            // this.gotonextpage();
        }
    }

    //custom login, which lead a navigater to afterLoginPageUri ---format as "/ping"
    loginAndTo(afterLoginPageUri:string) {


        if (this.isLoggedIn) {
            this.router.navigate([afterLoginPageUri]);
        }
        else {

            console.log("Starting processing of login...");

            auth0.show({
                // Params: {
                //   scope: 'openid email roles user_metadata app_metadata picture offline_access',
                //   // device: 'Mobile device'
                // },
                // auth: {
                //   // redirect: false,
                //   params: {
                //     scope: 'openid email roles user_metadata app_metadata picture offline_access',
                //   }
                // },
                closable: true,
                autoclose: true,
                rememberLastLogin: true,//!prompt, rememberLastLogin function still not support.
                languageDictionary: {
                    emailInputPlaceholder: "something@youremail.com",
                    title: "Log me in"
                },
            })
                .then((args) => {
                    console.log(args.profile);
                    console.log(args.token);
                    //This will done by plugin: not here.
                    // appSettings.setString("auth0Token", JSON.stringify(args));

                    // let afterLoginPageUri = "/ping";
                    this.router.navigate([afterLoginPageUri]);

                    console.log("login ok point 1 !");


                }, (error) => {
                    alert(error);
                });

            console.log("login ok point b2 !");
            // this.gotonextpage();
        }
    }


    //This is for standard login, which lead a navigater to   "/ping"
    logoff() {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");

        let afterLogoffPageUri = "/ping";
        this.router.navigate([afterLogoffPageUri]);
    }

    //custom logoff, which lead a navigater to afterLoginPageUri ---format as "/ping"
    logoffAndTo(afterLogoffPageUri:string) {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");

        // let afterLogoffPageUri = "/ping";
        this.router.navigate([afterLogoffPageUri]);
    }


    // resetPassword(email) {
    //
    // }


    handleErrors(error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    }
}