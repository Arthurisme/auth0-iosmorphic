"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// import {Http, ConnectionBackend}      from '@angular/http';
var http_1 = require('@angular/http');
require("rxjs/add/operator/map");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var PingComponent = (function () {
    function PingComponent(router, http) {
        this.router = router;
        this.http = http;
        this.API_URL = 'http://localhost:3001';
        this.messagePing = 'begin text';
        this.messageSecurityPing = 'begin text';
    }
    PingComponent.prototype.ngOnInit = function () {
    };
    PingComponent.prototype.ping = function () {
        var _this = this;
        this.messagePing = '';
        console.log("start ping");
        var tokenAtLocal = appSettings.getString('auth0Token');
        var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);
        //test this.http @angular
        this.http.get(this.API_URL + "/ping")
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log("data origin:");
            console.log(data);
            console.log("data._body origin:");
            console.log(data.toString());
            _this.messagePing = data.toString();
            _this.messageLast = _this.messagePing;
            // this.messages =  ((JSON.parse(data)));
            // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
            // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            // this.messages =  (JSON.parse(JSON.stringify(data))._body);
            console.log("messageORs from http.get() :");
            console.log(_this.messageLast);
            // this.message =  data._body ;
        }, function (error) { return _this.messagePing = error._body; });
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
    };
    PingComponent = __decorate([
        core_1.Component({
            selector: "gr-ping",
            templateUrl: "ping/ping.component.html",
            styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], PingComponent);
    return PingComponent;
}());
exports.PingComponent = PingComponent;
//# sourceMappingURL=ping.component.js.map