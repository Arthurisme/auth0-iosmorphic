import {Component, ElementRef, OnInit, ViewChild,NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {Http, Headers}      from '@angular/http';

import "rxjs/add/operator/map";


var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
import {NavigateService} from "../shared/service/navigate.service";

var nshttp = require("http");
// import {NS_HTTP_PROVIDERS} from 'nativescript-angular/http';
// import {HeaderComponent} from "../header/header.component"

// import {alert, setHintColor, LoginService, User} from "../shared";



import {Config} from "../config/config";


import platform = require("platform");
import screen = platform.screen;


var application = require('application');

var orientation = require('nativescript-orientation');
console.log(orientation.getOrientation());  // Returns the enum DeviceOrientation value

@Component({
    selector: "gr-ping",
    templateUrl: "ping/ping.component.html",
    styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
})
export class PingComponent implements OnInit {
    public screenWidth: number = 399;
    public screenHeight: number = 399;
    public orientationIsPort: boolean;
    public counter: number = 399;

    config:Config = new Config();


    // API_URL:string = 'http://localhost:3001';
    messagePing:string = 'begin text';
    messageSecurityPing:string = 'begin text';
    messageLast:string;

    constructor(private router:Router,
                private http:Http,
                private navigateService:NavigateService,
                public _ngZone:NgZone
                // _backend: ConnectionBackend
    ) {
        console.log("orientation:");  // Returns the enum DeviceOrientation value
        console.log(orientation.getOrientation());  // Returns the enum DeviceOrientation value


        //update new orientation:
        // this.onOrientationChange;
        // application.on(application.orientationChangedEvent,this.onOrientationChange);
        // this.onOrientationChange();




        // this.orientationIsPort = true;


        application.on(application.orientationChangedEvent, () =>  this._ngZone.run(() => {


            setTimeout(() => {

                // this.screenWidth = screen.mainScreen.widthPixels;
                // this.screenHeight = screen.mainScreen.heightPixels;
                //
                // console.log("Screen width: " + this.screenWidth);
                // console.log("Screen height: " + this.screenHeight);
                //
                // if (this.screenWidth > this.screenHeight) {
                //     this.orientationIsPort = false;
                // }
                //
                // if (this.screenWidth < this.screenHeight) {
                //     this.orientationIsPort = true;
                // }
                //
                // console.log("orientation: " + this.orientationIsPort);
                //
                //
                // console.log("change in the orientation");
                // console.log("CCCccccccccdddffggcccc");

                this.onOrientationChange();

            },1000  );



        }));


        // this.screenWidth = screen.mainScreen.widthPixels;
        // this.screenHeight = screen.mainScreen.heightPixels;
        //
        // console.log("Screen width: " + this.screenWidth);
        // console.log("Screen height: " + this.screenHeight);
        //
        // if (this.screenWidth > this.screenHeight) {
        //     this.orientationIsPort = false;
        // }
        //
        // if (this.screenWidth < this.screenHeight) {
        //     this.orientationIsPort = true;
        // }
        //
        // console.log("orientation: " + this.orientationIsPort);
        //
        //
        // console.log("change in the orientation");
        // console.log("CCCcccccccccccc");

        this.onOrientationChange();


    }

    ngOnInit() {
        console.log("orientation:");  // Returns the enum DeviceOrientation value
        console.log(orientation.getOrientation());  // Returns the enum DeviceOrientation value
        this.onOrientationChange();
        // this.orientationIsPort = true;

    }


    public ping() {
        this.messagePing = '';
        console.log("start ping");
        // let tokenAtLocal = appSettings.getString('auth0Token');
        // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        // console.log("tokenAtLocal");
        // console.log(tokenAtLocal);

        //Using  http @angular
        this.http.get(`${this.config.apiUrl}/ping`)
            .map(res => res.json())
            .subscribe(
                data => {

                    console.log("data origin:");
                    console.log(data);
                    console.log("data._body origin:");
                    console.log(data.toString());

                    this.messagePing = data.toString();
                    this.messageLast = this.messagePing;
                    // this.messages =  ((JSON.parse(data)));

                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                    // this.messages =  (JSON.parse(JSON.stringify(data))._body);
                    console.log("messageLast from http.get() :");
                    console.log(this.messageLast);
                    // this.message =  data._body ;
                },

                error => this.messagePing = error._body
            );
        //End Using  http @angular


        //Using ns http:
        // http.request({
        //     url: `${this.API_URL}/ping`,
        //     method: "GET"
        // }).then( (response) => {
        //
        //     let str = response.content.toString();
        //     console.log("result str:");
        //     console.log(str);
        //
        //
        //     this.message = str;
        //     this.messageORs=this.message;
        //     // this.message = "test message after ping.";
        //
        //
        // }, function (err) {
        //     console.log(err);
        // });
        //End Using ns http


    }


    public securedPing() {


        this.messageSecurityPing = '';
        console.log("start ping");

        //Debug:
        //Get idToken from auth0Token:
        let tokenAtLocal = appSettings.getString("auth0Token");
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);

        var idTokenJson = JSON.parse(appSettings.getString("auth0Token")).idToken;
        console.log("idTokenJson");
        console.log(idTokenJson);


        //Using  http @angular
        this.http.get(`${this.config.apiUrl}/secured/ping`, {headers: new Headers({'Authorization': 'Bearer ' + JSON.parse(appSettings.getString("auth0Token")).idToken})})
            .map(res => res.json())
            .subscribe(
                data => {

                    console.log("data origin:");
                    console.log(data);
                    console.log("data._body origin:");
                    console.log(data.toString());

                    this.messageSecurityPing = data.toString();
                    this.messageLast = this.messageSecurityPing;
                    // this.messages =  ((JSON.parse(data)));

                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                    // this.messages =  (JSON.parse(JSON.stringify(data))._body);
                    console.log("messageLast from http.get() :");
                    console.log(this.messageLast);
                    // this.message =  data._body ;
                },

                error => this.messagePing = error._body
            );
        //End Using  http @angular


        //@Using ns http:
        // this.messageSecurityPing = '';
        // console.log("start ping");
        // let tokenAtLocal = appSettings.getString('auth0Token');
        // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        // console.log("tokenAtLocal");
        // console.log(tokenAtLocal);
        // console.log("tokenData");
        // console.log(tokenData);
        //
        // let idTokenJson = tokenData.idToken;
        // console.log("idTokenJson");
        // console.log(idTokenJson);
        //
        //
        // let header = {'Authorization': 'Bearer ' + idTokenJson};
        // //or in some http:  headers: { "Content-Type": "application/json" },
        //
        //
        // nshttp.request({
        //     url: `${this.API_URL}/secured/ping`,
        //     method: "GET",
        //     headers: header
        //
        // }).then((response) => {
        //
        //     let str = response.content.toString();
        //     console.log("result str:");
        //     console.log(str);
        //
        //
        //     this.messageSecurityPing = str;
        //     this.messageLast = this.messageSecurityPing;
        //
        //     // this.message = "test message after ping.";
        //
        //
        // }, function (err) {
        //     console.log(err);
        // });
        //@End Using ns http


    }


    onOrientationChange() {

        //     // We have an orientation event
        //     console.log("orientation:");  // Returns the enum DeviceOrientation value
        //     console.log(orientation.getOrientation());  // Returns the enum DeviceOrientation value
        //
        //
        //
        //     if(orientation.getOrientation() === "landscape"){
        //         this.orientationIsPort = false;
        //         console.log("is port?:");  // Returns the enum DeviceOrientation value
        //         console.log(this.orientationIsPort);  // Returns the enum DeviceOrientation value
        //         console.log("llllllllllllll");
        //
        //     }else{
        //         this.orientationIsPort = true;
        //         console.log("is port?:");  // Returns the enum DeviceOrientation value
        //         console.log(this.orientationIsPort);  // Returns the enum DeviceOrientation value
        //         console.log("pppppppppppppp");
        //
        //     }

        // setTimeout(() => {
        //
        //     // We have an orientation event
        //     console.log("orientation:");  // Returns the enum DeviceOrientation value
        //     console.log(orientation.getOrientation());  // Returns the enum DeviceOrientation value
        //
        //
        //
        //     if(orientation.getOrientation() === "landscape"){
        //         this.orientationIsPort = false;
        //         console.log("is port?:");  // Returns the enum DeviceOrientation value
        //         console.log(this.orientationIsPort);  // Returns the enum DeviceOrientation value
        //         console.log("llllllllllllll");
        //
        //     }else{
        //         this.orientationIsPort = true;
        //         console.log("is port?:");  // Returns the enum DeviceOrientation value
        //         console.log(this.orientationIsPort);  // Returns the enum DeviceOrientation value
        //         console.log("pppppppppppppp");
        //
        //     }
        //
        //
        // },1000  );


        // setTimeout(() => {
        //
        //     // We have an orientation event
        //     this.screenWidth = screen.mainScreen.widthPixels;
        //     this.screenHeight = screen.mainScreen.heightPixels;
        //
        //     console.log("Screen width: " + this.screenWidth);
        //     console.log("Screen height: " + this.screenHeight);
        //
        //     if (this.screenWidth > this.screenHeight) {
        //         this.orientationIsPort = false;
        //     }
        //
        //     if (this.screenWidth < this.screenHeight) {
        //         this.orientationIsPort = true;
        //     }
        //
        //     console.log("orientation: " + this.orientationIsPort);
        //
        //
        //     console.log("change in the orientation");
        //     console.log("CCCccccccccdddffggcccc");
        //
        //
        // },1000  );


        this.screenWidth = screen.mainScreen.widthPixels;
        this.screenHeight = screen.mainScreen.heightPixels;

        console.log("Screen width: " + this.screenWidth);
        console.log("Screen height: " + this.screenHeight);

        if (this.screenWidth > this.screenHeight) {
            this.orientationIsPort = false;
        }

        if (this.screenWidth < this.screenHeight) {
            this.orientationIsPort = true;
        }

        console.log("orientation: " + this.orientationIsPort);


        console.log("change in the orientation");
        console.log("CCCccccccccdddffggcccc");


    }




}
