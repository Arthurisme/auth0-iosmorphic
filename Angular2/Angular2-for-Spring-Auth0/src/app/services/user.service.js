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
var http_1 = require('@angular/http');
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.API_URL = 'http://localhost:3001';
    }
    UserService.prototype.getUserByName = function (username) {
        console.log(" id_token already was (user.service.ts): \n");
        console.log(localStorage.getItem("id_token"));
        var url = "http://localhost:3001/rest/user/username";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, username, { headers: header });
    };
    UserService.prototype.updateUser = function (user) {
        var url = "http://localhost:3001/rest/user/update";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, JSON.stringify(user), { headers: header });
    };
    UserService.prototype.bindingUserToSpring = function () {
        console.log("binding clicked  past to on user.service. ");
        var userUrl = "http://localhost:3001/api/v1/user/binding";
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let header2 = new Headers({'Content-Type': 'application/json', 'Authorization':'Bearer '+localStorage.getItem("token")});
        var header = new http_1.Headers({ 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        console.log("binding clicked  past (just before return) to on user.service. ");
        return this.http.get(this.API_URL + "/api/v1/user/binding", { headers: header });
        // return this.http.get(userUrl);
    };
    UserService.prototype.bindingUserToSpringTest1 = function () {
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
            console.log(_this.message);
            // this.message =  data._body ;
        }, function (error) { return _this.message = error._body; });
    };
    UserService.prototype.bindingUserToSpringTest2 = function () {
        var _this = this;
        this.message = '';
        console.log("start ping");
        var tokenAtLocal = localStorage.getItem('id_token');
        console.log("tokenAtLocal storaged already was: \n");
        console.log(tokenAtLocal);
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + tokenAtLocal });
        this.http.get(this.API_URL + "/api/v1/user/binding", { headers: headers })
            .subscribe(function (data) {
            console.log("data origin:");
            console.log(data);
            // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            _this.message = (JSON.parse(JSON.stringify(data))._body);
            console.log(_this.message);
            // this.message =  data._body ;
        }, function (error) { return _this.message = error._body; });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map