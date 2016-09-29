"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// import {Http, ConnectionBackend}      from '@angular/http';
var http_1 = require('@angular/http');
require("rxjs/add/operator/map");
var auth0 = require("nativescript-auth0");
var application = require("application");
// import {HeaderComponent} from "../header/header.component";
var MyComponentbComponent = (function () {
    function MyComponentbComponent(router, http) {
        this.router = router;
        this.http = http;
        this.API_URL = 'http://localhost:3001';
        this.messagePing = 'begin text';
        this.messageSecurityPing = 'begin text';
    }
    MyComponentbComponent.prototype.ngOnInit = function () {
    };
    // public ping() {
    //     this.messagePing = '';
    //     console.log("start ping");
    //     // let tokenAtLocal = appSettings.getString('auth0Token');
    //     // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //     // console.log("tokenAtLocal");
    //     // console.log(tokenAtLocal);
    //
    //     //test this.http @angular
    //     this.http.get(`${this.API_URL}/ping`)
    //     .map(res => res.json())
    //         .subscribe(
    //             data => {
    //
    //                 console.log( "data origin:");
    //                 console.log( data);
    //                 console.log( "data._body origin:");
    //                 console.log(data.toString());
    //
    //                 this.messagePing = data.toString();
    //                 this.messageLast=this.messagePing;
    //                 // this.messages =  ((JSON.parse(data)));
    //
    //                 // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
    //                 // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
    //                 // this.messages =  (JSON.parse(JSON.stringify(data))._body);
    //                 console.log( "messageORs from http.get() :");
    //                 console.log( this.messageLast);
    //                 // this.message =  data._body ;
    //             },
    //
    //             error => this.messagePing = error._body
    //         );
    //     //End test this.http @angular
    //
    //
    //     // http.request({
    //     //     url: `${this.API_URL}/ping`,
    //     //     method: "GET"
    //     // }).then( (response) => {
    //     //
    //     //     let str = response.content.toString();
    //     //     console.log("result str:");
    //     //     console.log(str);
    //     //
    //     //
    //     //     this.message = str;
    //     //     this.messageORs=this.message;
    //     //     // this.message = "test message after ping.";
    //     //
    //     //
    //     // }, function (err) {
    //     //     console.log(err);
    //     // });
    //
    // }
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
    MyComponentbComponent.prototype.goToGroceries = function () {
        this.router.navigate(["/groceries"]);
    };
    MyComponentbComponent = __decorate([
        core_1.Component({
            selector: "actionbar-headerb",
            templateUrl: "modules/my-componentb/my-componentb.component.html",
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], MyComponentbComponent);
    return MyComponentbComponent;
}());
exports.MyComponentbComponent = MyComponentbComponent;
//# sourceMappingURL=my-componentb.component.js.map