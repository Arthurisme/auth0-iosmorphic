import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
// import {Http, ConnectionBackend}      from '@angular/http';
import {Http, Headers   }      from '@angular/http';
import "rxjs/add/operator/map";
// var http = require("http");
// import {NS_HTTP_PROVIDERS} from 'nativescript-angular/http';


import {alert, setHintColor, LoginService, User} from "../shared";
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";


@Component({
    selector: "gr-ping",
    templateUrl: "ping/ping.component.html",
    styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
})
export class PingComponent implements OnInit {

    API_URL:string = 'http://localhost:3001';
    message:string = 'begin text';
    messages:string = 'begin text';
    messageORs:string;

    constructor(private router:Router
                ,  private http: Http
    // _backend: ConnectionBackend
    ) {

    }

    ngOnInit() {
    }


    public ping() {
        this.message = '';
        console.log("start ping");
        let tokenAtLocal = appSettings.getString('auth0Token');
        var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);

        //test this.http @angular
        this.http.get(`${this.API_URL}/ping`)
        .map(res => res.json())
            .subscribe(
                data => {

                    console.log( "data origin:");
                    console.log( data);
                    console.log( "data._body origin:");
                    console.log( data);

                    this.messages = data;
                    this.messageORs=this.messages;
                    // this.messages =  ((JSON.parse(data)));

                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
                    // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                    // this.messages =  (JSON.parse(JSON.stringify(data))._body);
                    console.log( "messageORs from http.get() :");
                    console.log( this.messageORs);
                    // this.message =  data._body ;
                },

                error => this.message = error._body
            );
        //End test this.http @angular


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

    }





    // public securedPing() {
    //     this.messages = '';
    //     console.log("start ping");
    //     let tokenAtLocal = appSettings.getString('auth0Token');
    //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //     console.log("tokenAtLocal");
    //     console.log(tokenAtLocal);
    //     console.log("tokenData");
    //     console.log(tokenData);
    //
    //     let idTokenJson =  tokenData.idToken;
    //     console.log("idTokenJson");
    //     console.log(idTokenJson);
    //
    //
    //
    //     let header =   {'Authorization': 'Bearer '+idTokenJson} ;
    //     //or in some http:  headers: { "Content-Type": "application/json" },
    //
    //
    //
    //     http.request({
    //         url: `${this.API_URL}/secured/ping`,
    //         method: "GET",
    //         headers: header
    //
    //     }).then( (response) => {
    //
    //         let str = response.content.toString();
    //         console.log("result str:");
    //         console.log(str);
    //
    //
    //         this.messages = str;
    //         this.messageORs=this.messages;
    //
    //         // this.message = "test message after ping.";
    //
    //
    //     }, function (err) {
    //         console.log(err);
    //     });
    //
    // }





    // public ping() {
    //     this.message = '';
    //     console.log("start ping");
    //     let tokenAtLocal = appSettings.getString('auth0Token');
    //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //
    //     console.log(tokenAtLocal);
    //
    //
    //     http.request({
    //         url: `${this.API_URL}/ping`,
    //         method: "GET"
    //     }).then(function (response) {
    //
    //         var str = response.content.toString();
    //         console.log("result str:");
    //         console.log(str);
    //
    //
    //         // this.message = str;
    //         this.message = "ttttt";
    //
    //
    //     }, function (err) {
    //         console.log(err);
    //     });
    //
    //
    // }


}