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
// Exact copy of contact.awesome.pipe
var core_1 = require('@angular/core');
var AwesomePipe = (function () {
    function AwesomePipe() {
    }
    AwesomePipe.prototype.transform = function (phrase) {
        return phrase ? 'Awesome ' + phrase : '';
    };
    AwesomePipe = __decorate([
        core_1.Pipe({ name: 'awesome' }), 
        __metadata('design:paramtypes', [])
    ], AwesomePipe);
    return AwesomePipe;
}());
exports.AwesomePipe = AwesomePipe;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdlc29tZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdlc29tZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMscUJBQW9DLGVBQWUsQ0FBQyxDQUFBO0FBSXBEO0lBQUE7SUFJQSxDQUFDO0lBSEMsK0JBQVMsR0FBVCxVQUFVLE1BQWM7UUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBTEg7UUFBQyxXQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7O21CQUFBO0lBTTFCLGtCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxtQkFBVyxjQUl2QixDQUFBO0FBR0Q7Ozs7RUFJRSJ9