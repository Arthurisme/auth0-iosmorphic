import { Injectable } from "@angular/core";
// import { getString, setString } from "application-settings";

import { User } from "../model/user.model";
// import { BackendService } from "./backend.service";

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";


import { alert, setHintColor, LoginService } from "../";
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";

const tokenKey = "auth0Token";

@Injectable()
export class Auth0LoginService {
  get isLoggedIn(): boolean {

    // Check to see if the user is logged in
    if(!appSettings.hasKey(tokenKey)){
      console.log("no token stored.");

      //if no token stored: go to login:
      // this.doLogin();
      return false;

    }else{
      console.log("has token stored");


      //Deserialzise the saved user
      var tokenData = JSON.parse(appSettings.getString(tokenKey));
      console.log("token begain: "+ appSettings.getString(tokenKey)+ " token end.");


      //Check if it's expired : go to login:
      // if(auth0.isTokenExpired(tokenData.token.idToken)){
      if(auth0.isTokenExpired(tokenData.idToken)){
        //Make them log in again
        console.log("token expired, login again.");

        // this.doLogin();
        return false;
      }else{
        //All good, navigate to your start page
        console.log("has token stored, go to next page");

        // this.gotonextpage();
        return true;
      }
    }


    // return !!getString(tokenKey);
  }

  private get token(): string {
    return appSettings.getString(tokenKey);
  }
  private set token(theToken: string) {
    appSettings.setString(tokenKey, theToken);
  }

  constructor(private router: Router
              // private backend: BackendService
  ) {
    // if (this.token) {
    //   this.backend.el.authentication.setAuthorization(this.token, "bearer");
    // }
  }

  // register(user: User) {
  //   return this.backend.el.Users.register(user.email, user.password)
  //     .catch(this.handleErrors);
  // }


  //This is for standard login, which lead a navigater to "/ping"
  login() {
    let afterLoginPageUri = "/ping";

    if(this.isLoggedIn){
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
  loginAndTo(afterLoginPageUri: string ) {


    if(this.isLoggedIn){
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
  logoffAndTo(afterLogoffPageUri: string) {
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