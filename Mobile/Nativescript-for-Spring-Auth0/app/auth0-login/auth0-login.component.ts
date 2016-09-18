import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";


import { alert, setHintColor, LoginService, User } from "../shared";
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
import {Auth0LoginService} from "../shared/Auth0-login.service";





@Component({
  selector: "my-auth0-login",
  templateUrl: "auth0-login/auth0-login.component.html",
  styleUrls: ["auth0-login/auth0-login-common.css", "auth0-login/auth0-login.component.css"],
})
export class Auth0LoginComponent   {






  constructor(private router: Router, private auth0LoginService:Auth0LoginService) {


      if(!this.auth0LoginService.isLoggedIn){
          this.doLogin() ;
      }
      else{
          this.gotonextpage()
      }


      // // Check to see if the user is logged in
      // if(!appSettings.hasKey("auth0Token")){
      //     console.log("no token stored.");
      //     // this.router.navigate(["/ping"]);
      //
      //     this.doLogin();
      //
      // }else{
      //     console.log("has token stored");
      //     // this.gotonextpage();
      //
      //
      //     //Deserialzise the saved user
      //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
      //     console.log("token begain: "+ appSettings.getString("auth0Token")+ " token end.");
      //
      //
      //     //Check if it's expired
      //     // if(auth0.isTokenExpired(tokenData.token.idToken)){
      //         if(auth0.isTokenExpired(tokenData.idToken)){
      //         //Make them log in again
      //         console.log("token expired, login again.");
      //
      //         this.doLogin();
      //     }else{
      //         //All good, navigate to your start page
      //         console.log("has token stored, go to next page");
      //
      //         this.gotonextpage();
      //     }
      // }

  }





    public doLogin() {
        console.log("doLoging start...");

        if(this.auth0LoginService.isLoggedIn){
            this.router.navigate(["/ping"]);
        }
        else {

            auth0.show().then( (args) =>{
                console.log(args.profile);
                console.log(args.token);
                // appSettings.setString("auth0Token", JSON.stringify(args));

                this.router.navigate(["/ping"]);

                console.log("login ok 1 !");


                // this.loginService.logoff();
                // this.router.navigate(["/groceries"]);
                // this.router.navigate(["/"]);


                // this.gotonextpage();
            }, (error) => {
                alert(error);
            });

        }



        console.log("login ok 2!");
        // this.gotonextpage();


    }
    doLogout() {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");
        this.router.navigate(["/auth0testpage"]);
    }

    gotonextpage() {
        this.router.navigate(["/ping"]);
        // this.router.navigate(["/groceries"]);
    // this.router.navigate(["/"]);

  }

    goToHome(){
        this.router.navigate(["/"]);

    }

  test1(){

  }
  test2(){
    this.test1();
    this.gotonextpage();
  }
}
