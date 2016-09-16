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
var core_1 = require('@angular/core');
var auth_service_1 = require('../../auth.service');
var angular2_jwt_1 = require('angular2-jwt');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var PingComponent = (function () {
    function PingComponent(auth, http, authHttp) {
        this.auth = auth;
        this.http = http;
        this.authHttp = authHttp;
        this.API_URL = 'http://localhost:3001';
    }
    PingComponent.prototype.ping = function () {
        var _this = this;
        this.message = '';
        console.log("start ping");
        var tokenAtLocal = localStorage.getItem('id_token');
        console.log("tokenAtLocal storaged already was: \n");
        console.log(tokenAtLocal);
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + tokenAtLocal });
        this.http.get(this.API_URL + "/ping", { headers: headers })
            .subscribe(function (data) {
            console.log("data origin:");
            console.log(data);
            // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            _this.message = (JSON.parse(JSON.stringify(data))._body);
            // this.message =  data._body ;
        }, function (error) { return _this.message = error._body; });
    };
    PingComponent.prototype.securedPing = function () {
        var _this = this;
        this.message = '';
        console.log("start ping");
        var tokenAtLocal = localStorage.getItem('id_token');
        console.log("tokenAtLocal storaged already was: \n");
        console.log(tokenAtLocal);
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + tokenAtLocal });
        this.http.get(this.API_URL + "/secured/ping", { headers: headers })
            .subscribe(function (data) {
            console.log(data);
            // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            _this.message = (JSON.parse(JSON.stringify(data))._body);
            // this.message =  data._body ;
        }, function (error) { return _this.message = error._body || error; });
    };
    PingComponent.prototype.securedPingorigin = function () {
        var _this = this;
        this.message = '';
        this.authHttp.get(this.API_URL + "/secured/ping")
            .subscribe(function (data) {
            console.log(data);
            // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            _this.message = (JSON.parse(JSON.stringify(data))._body);
            // this.message =  data._body ;
        }, function (error) { return _this.message = error._body || error; });
    };
    PingComponent = __decorate([
        core_1.Component({
            selector: 'ping',
            templateUrl: 'app/components/ping/ping.template.html'
        }), 
        __metadata('design:paramtypes', [auth_service_1.Auth, http_1.Http, angular2_jwt_1.AuthHttp])
    ], PingComponent);
    return PingComponent;
}());
exports.PingComponent = PingComponent;
;
//# sourceMappingURL=ping.component.js.map