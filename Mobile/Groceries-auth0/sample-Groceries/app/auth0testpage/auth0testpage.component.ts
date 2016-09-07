import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";


import { alert, setHintColor, LoginService, User } from "../shared";
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";





@Component({
  selector: "gr-auth0testpage",
  templateUrl: "auth0testpage/auth0testpage.component.html",
  styleUrls: ["auth0testpage/auth0testpage-common.css", "auth0testpage/auth0testpage.component.css"],
})
export class Auth0testpageComponent   {






  constructor(private router: Router) {

      //Check to see if the user is logged in
      if(!appSettings.hasKey("auth0Token")){
          console.log("no token stored");

          this.doLogin();

      }else{
          console.log("has token stored");

          //Deserialzise the saved user
          var tokenData = JSON.parse(appSettings.getString("auth0Token"));

          //Check if it's expired
          if(auth0.isTokenExpired(tokenData.idToken)){
              //Make them log in again
              this.doLogin();
          }else{
              //All good, navigate to your start page
              this.goToHome();
          }
      }

  }





    public doLogin() {
        console.log("TTTTT");

        auth0.show().then( (args) =>{
            console.log(args.profile);
            console.log(args.token);

            console.log("login ok 1!");


            // this.loginService.logoff();
            this.router.navigate(["/groceries"]);
            // this.router.navigate(["/"]);
            // this.gotonextpage();

            appSettings.setString("UserData", JSON.stringify(args));
        }, (error) => {
            alert(error);
        });

        console.log("login ok 2!");
        // this.gotonextpage();


    }

    gotonextpage() {
    this.router.navigate(["/groceries"]);
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
