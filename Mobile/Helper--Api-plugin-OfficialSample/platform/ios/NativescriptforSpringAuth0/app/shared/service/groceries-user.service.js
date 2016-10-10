// Crazy copy of the app/user.service
// Proves that UserService is an app-wide singleton and only instantiated once
// IFF shared.module follows the `forRoot` pattern
//
// If it didn't, a new instance of UserService would be created
// after each lazy load and the userName would double up.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var nextId = 1;
var GroceriesUserServiceConfig = (function () {
    function GroceriesUserServiceConfig() {
        this.userName = 'Philip Marlowe';
    }
    return GroceriesUserServiceConfig;
}());
exports.GroceriesUserServiceConfig = GroceriesUserServiceConfig;
var GroceriesUserService = (function () {
    function GroceriesUserService(config) {
        this.id = nextId++;
        this._userName = 'Sherlock Holmes';
        if (config) {
            this._userName = config.userName;
        }
    }
    Object.defineProperty(GroceriesUserService.prototype, "userName", {
        get: function () {
            // Demo: add a suffix if this service has been created more than once
            var suffix = this.id > 1 ? " times " + this.id : '';
            return this._userName + suffix;
        },
        enumerable: true,
        configurable: true
    });
    GroceriesUserService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [GroceriesUserServiceConfig])
    ], GroceriesUserService);
    return GroceriesUserService;
}());
exports.GroceriesUserService = GroceriesUserService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLXVzZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy11c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBQ3JDLDhFQUE4RTtBQUM5RSxrREFBa0Q7QUFDbEQsRUFBRTtBQUNGLCtEQUErRDtBQUMvRCx5REFBeUQ7Ozs7Ozs7Ozs7Ozs7O0FBRXpELHFCQUFxQyxlQUFlLENBQUMsQ0FBQTtBQUVyRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZjtJQUFBO1FBQ0UsYUFBUSxHQUFHLGdCQUFnQixDQUFDO0lBQzlCLENBQUM7SUFBRCxpQ0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksa0NBQTBCLDZCQUV0QyxDQUFBO0FBR0Q7SUFJRSw4QkFBd0IsTUFBa0M7UUFIMUQsT0FBRSxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQ04sY0FBUyxHQUFHLGlCQUFpQixDQUFDO1FBR3BDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxzQkFBSSwwQ0FBUTthQUFaO1lBQ0UscUVBQXFFO1lBQ3JFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFlBQVUsSUFBSSxDQUFDLEVBQUksR0FBRyxFQUFFLENBQUM7WUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBYkg7UUFBQyxpQkFBVSxFQUFFO21CQUtFLGVBQVEsRUFBRTs7NEJBTFo7SUFjYiwyQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksNEJBQW9CLHVCQWFoQyxDQUFBO0FBR0Q7Ozs7RUFJRSJ9