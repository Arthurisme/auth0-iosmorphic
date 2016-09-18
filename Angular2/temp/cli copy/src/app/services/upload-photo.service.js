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
var UploadPhotoService = (function () {
    function UploadPhotoService() {
        this.filesToUpload = [];
    }
    UploadPhotoService.prototype.upload = function () {
        this.makeFileRequest("http://localhost:3001/rest/photo/upload", [], this.filesToUpload).
            then(function (result) {
            console.log(result);
        }, function (error) {
            console.error(error);
        });
    };
    UploadPhotoService.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
    };
    UploadPhotoService.prototype.makeFileRequest = function (url, params, files) {
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            for (var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        alert("upload Successful");
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("id_token"));
            xhr.send(formData);
        });
    };
    UploadPhotoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UploadPhotoService);
    return UploadPhotoService;
}());
exports.UploadPhotoService = UploadPhotoService;
//# sourceMappingURL=upload-photo.service.js.map