"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require('@angular/http');
require("rxjs/add/operator/map");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var navigate_service_1 = require("../shared/service/navigate.service");
var nshttp = require("http");
// import {NS_HTTP_PROVIDERS} from 'nativescript-angular/http';
// import {HeaderComponent} from "../header/header.component"
// import {alert, setHintColor, LoginService, User} from "../shared";
var config_1 = require("../config/config");
var PingComponent = (function () {
    function PingComponent(router, http, navigateService) {
        this.router = router;
        this.http = http;
        this.navigateService = navigateService;
        this.config = new config_1.Config();
        // API_URL:string = 'http://localhost:3001';
        this.messagePing = 'begin text';
        this.messageSecurityPing = 'begin text';
    }
    PingComponent.prototype.ngOnInit = function () {
    };
    PingComponent.prototype.ping = function () {
        var _this = this;
        this.messagePing = '';
        console.log("start ping");
        // let tokenAtLocal = appSettings.getString('auth0Token');
        // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
        // console.log("tokenAtLocal");
        // console.log(tokenAtLocal);
        //Using  http @angular
        this.http.get(this.config.apiUrl + "/ping")
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
            console.log("messageLast from http.get() :");
            console.log(_this.messageLast);
            // this.message =  data._body ;
        }, function (error) { return _this.messagePing = error._body; });
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
    };
    PingComponent.prototype.securedPing = function () {
        var _this = this;
        this.messageSecurityPing = '';
        console.log("start ping");
        //Debug:
        //Get idToken from auth0Token:
        var tokenAtLocal = appSettings.getString("auth0Token");
        console.log("tokenAtLocal");
        console.log(tokenAtLocal);
        var idTokenJson = JSON.parse(appSettings.getString("auth0Token")).idToken;
        console.log("idTokenJson");
        console.log(idTokenJson);
        //Using  http @angular
        this.http.get(this.config.apiUrl + "/secured/ping", { headers: new http_1.Headers({ 'Authorization': 'Bearer ' + JSON.parse(appSettings.getString("auth0Token")).idToken }) })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log("data origin:");
            console.log(data);
            console.log("data._body origin:");
            console.log(data.toString());
            _this.messageSecurityPing = data.toString();
            _this.messageLast = _this.messageSecurityPing;
            // this.messages =  ((JSON.parse(data)));
            // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
            // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            // this.messages =  (JSON.parse(JSON.stringify(data))._body);
            console.log("messageLast from http.get() :");
            console.log(_this.messageLast);
            // this.message =  data._body ;
        }, function (error) { return _this.messagePing = error._body; });
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
    };
    PingComponent = __decorate([
        core_1.Component({
            selector: "gr-ping",
            templateUrl: "ping/ping.component.html",
            styleUrls: ["ping/ping-common.css", "ping/ping.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http, navigate_service_1.NavigateService])
    ], PingComponent);
    return PingComponent;
}());
exports.PingComponent = PingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXVELGVBQWUsQ0FBQyxDQUFBO0FBQ3ZFLHVCQUFxQixpQkFBaUIsQ0FBQyxDQUFBO0FBQ3ZDLHFCQUFpQyxlQUFlLENBQUMsQ0FBQTtBQUVqRCxRQUFPLHVCQUF1QixDQUFDLENBQUE7QUFHL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLElBQVksV0FBVyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDcEQsaUNBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFFbkUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLCtEQUErRDtBQUMvRCw2REFBNkQ7QUFFN0QscUVBQXFFO0FBR3JFLHVCQUFxQixrQkFBa0IsQ0FBQyxDQUFBO0FBU3hDO0lBVUksdUJBQW9CLE1BQWEsRUFDYixJQUFTLEVBQ1QsZUFBK0I7UUFGL0IsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQUNiLFNBQUksR0FBSixJQUFJLENBQUs7UUFDVCxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFWbkQsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7UUFHOUIsNENBQTRDO1FBQzVDLGdCQUFXLEdBQVUsWUFBWSxDQUFDO1FBQ2xDLHdCQUFtQixHQUFVLFlBQVksQ0FBQztJQVUxQyxDQUFDO0lBRUQsZ0NBQVEsR0FBUjtJQUNBLENBQUM7SUFHTSw0QkFBSSxHQUFYO1FBQUEsaUJBMERDO1FBekRHLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsMERBQTBEO1FBQzFELG1F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