"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// import { Http,Headers }      from '@angular/http';
var http = require("http");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var PingComponent = (function () {
    function PingComponent(router) {
        this.router = router;
        this.API_URL = 'http://localhost:3001';
        this.message = 'begin text';
        this.messages = 'begin text';
    }
    PingComponent.prototype.ngOnInit = function () {
    };
    PingComponent.prototype.ping = function () {
        var _this = this;
        this.message = '';
        console.log("start ping");
        var tokenAtLocal = appSettings.getString('auth0Token');
        var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);
        http.request({
            url: this.API_URL + "/ping",
            method: "GET"
        }).then(function (response) {
            var str = response.content.toString();
            console.log("result str:");
            console.log(str);
            _this.message = str;
            _this.messageORs = _this.message;
            // this.message = "test message after ping.";
        }, function (err) {
            console.log(err);
        });
    };
    PingComponent.prototype.securedPing = function () {
        var _this = this;
        this.messages = '';
        console.log("start ping");
        var tokenAtLocal = appSettings.getString('auth0Token');
        var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);
        console.log("tokenData");
        console.log(tokenData);
        var idTokenJson = tokenData.idToken;
        console.log("idTokenJson");
        console.log(idTokenJson);
        var header = { 'Authorization': 'Bearer ' + idTokenJson };
        //or in some http:  headers: { "Content-Type": "application/json" },
        http.request({
            url: this.API_URL + "/secured/ping",
            method: "GET",
            headers: header
        }).then(function (response) {
            var str = response.content.toString();
            console.log("result str:");
            console.log(str);
            _this.messages = str;
            _this.messageORs = _this.messages;
            // this.message = "test message after ping.";
        }, function (err) {
            console.log(err);
        });
    };
    PingComponent = __decorate([
        core_1.Component({
            selector: "gr-ping",
            templateUrl: "ping/ping.component.html",
            styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], PingComponent);
    return PingComponent;
}());
exports.PingComponent = PingComponent;
//# sourceMappingURL=ping.component.js.map