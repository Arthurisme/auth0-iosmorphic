import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Http, Headers}      from '@angular/http';

import "rxjs/add/operator/map";


var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
import {NavigateService} from "../shared/service/navigate.service";

// var http = require("http");
// import {NS_HTTP_PROVIDERS} from 'nativescript-angular/http';
// import {HeaderComponent} from "../header/header.component"

// import {alert, setHintColor, LoginService, User} from "../shared";


@Component({
    selector: "gr-ping",
    templateUrl: "ping/ping.component.html",
    styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
})
export class PingComponent implements OnInit {

    API_URL:string = 'http://localhost:3001';
    messagePing:string = 'begin text';
    messageSecurityPing:string = 'begin text';
    messageLast:string;

    constructor(private router:Router,
                private http:Http,
                private navigateService:NavigateService

                // _backend: ConnectionBackend
    ) {

    }

    ngOnInit() {
    }


    public ping() {
        this.messagePing = '';
        console.log("start ping");
        // let tokenAtLocal = appSettings.getString('auth0Token');
        // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        // console.log("tokenAtLocal");
        // console.log(tokenAtLocal);

        //Using  http @angular
        this.http.get(`${this.API_URL}/ping`)
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

        let tokenAtLocal = appSettings.getString('auth0Token');
        var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        console.log("tokenAtLocal");
        // console.log(tokenAtLocal);

        let headers = new Headers();
        // headers.append("Authorization", "Bearer " + Config.token);
        headers.append("Authorization", "Bearer " + tokenAtLocal);
        headers.append("Content-Type", "application/json");

        //Using  http @angular
        this.http.get(`${this.API_URL}/secured/ping`, { headers: headers })
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
        // http.request({
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


}
