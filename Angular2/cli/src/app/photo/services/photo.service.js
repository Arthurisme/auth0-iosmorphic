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
var PhotoService = (function () {
    function PhotoService(http) {
        this.http = http;
    }
    PhotoService.prototype.getPhotosByUser = function (user) {
        var url = "http://localhost:3001/rest/photo/user";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, user, { headers: header });
    };
    PhotoService.prototype.getPhotosByUsername = function (username) {
        var url = "http://localhost:3001/rest/photo/username";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, username, { headers: header });
    };
    //fake, not work: test only:
    PhotoService.prototype.getPhotosByUserId = function (userId) {
        var url = "http://localhost:3001/rest/photo/userId";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, userId, { headers: header });
    };
    PhotoService.prototype.getPhotoById = function (photoId) {
        var url = "http://localhost:3001/rest/photo/photoId";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, JSON.stringify(photoId), { headers: header });
    };
    PhotoService.prototype.updatePhoto = function (photo) {
        var url = "http://localhost:3001/rest/photo/update";
        var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.post(url, JSON.stringify(photo), { headers: header });
    };
    PhotoService.prototype.getPhotos = function () {
        var url = "http://localhost:3001/photo/allPhotos";
        return this.http.get(url);
    };
    PhotoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PhotoService);
    return PhotoService;
}());
exports.PhotoService = PhotoService;
//# sourceMappingURL=photo.service.js.map