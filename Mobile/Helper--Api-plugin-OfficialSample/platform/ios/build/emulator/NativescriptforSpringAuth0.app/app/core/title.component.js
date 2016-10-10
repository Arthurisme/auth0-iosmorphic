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
// Exact copy of app/title.component.ts except import UserService from shared
var core_1 = require('@angular/core');
var groceries_user_service_1 = require('../shared/service/groceries-user.service');
var TitleComponent = (function () {
    function TitleComponent(groceriesUserService) {
        this.subtitle = '';
        this.title = 'Angular Modules';
        this.user = '';
        this.user = groceriesUserService.userName;
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TitleComponent.prototype, "subtitle", void 0);
    TitleComponent = __decorate([
        core_1.Component({
            // moduleId: module.id,
            selector: 'app-title',
            templateUrl: 'title.component.html',
        }), 
        __metadata('design:paramtypes', [groceries_user_service_1.GroceriesUserService])
    ], TitleComponent);
    return TitleComponent;
}());
exports.TitleComponent = TitleComponent;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGl0bGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw2RUFBNkU7QUFDN0UscUJBQWlDLGVBQWUsQ0FBQyxDQUFBO0FBQ2pELHVDQUEwQywwQ0FBMEMsQ0FBQyxDQUFBO0FBT3JGO0lBS0Usd0JBQVksb0JBQTBDO1FBSjdDLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDdkIsVUFBSyxHQUFHLGlCQUFpQixDQUFDO1FBQzFCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFHUixJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLFFBQVEsQ0FBQztJQUM1QyxDQUFDO0lBTkQ7UUFBQyxZQUFLLEVBQUU7O29EQUFBO0lBTlY7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsdUJBQXVCO1lBQ3ZCLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSxzQkFBc0I7U0FDcEMsQ0FBQzs7c0JBQUE7SUFTRixxQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksc0JBQWMsaUJBUTFCLENBQUE7QUFHRDs7OztFQUlFIn0=