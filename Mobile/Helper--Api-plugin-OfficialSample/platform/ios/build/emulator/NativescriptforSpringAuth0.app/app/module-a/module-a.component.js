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
var page_1 = require("ui/page");
var navigate_service_1 = require("../shared/service/navigate.service");
var ModuleAComponent = (function () {
    function ModuleAComponent(router, navigateService, page) {
        this.router = router;
        this.navigateService = navigateService;
        this.page = page;
    }
    ModuleAComponent.prototype.ngOnInit = function () {
        // this.page.actionBarHidden = true;
    };
    ModuleAComponent = __decorate([
        core_1.Component({
            selector: "ar-module-a",
            templateUrl: "module-a/module-a.component.html",
            styleUrls: ["module-a/module-a-common.css", "module-a/module-a.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, navigate_service_1.NavigateService, page_1.Page])
    ], ModuleAComponent);
    return ModuleAComponent;
}());
exports.ModuleAComponent = ModuleAComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLWEuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLWEuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBeUQsZUFBZSxDQUFDLENBQUE7QUFDekUsdUJBQXVCLGlCQUFpQixDQUFDLENBQUE7QUFNekMscUJBQXFCLFNBQVMsQ0FBQyxDQUFBO0FBSS9CLGlDQUE4QixvQ0FBb0MsQ0FBQyxDQUFBO0FBT25FO0lBT0UsMEJBQW9CLE1BQWMsRUFDZCxlQUErQixFQUMvQixJQUFVO1FBRlYsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQixTQUFJLEdBQUosSUFBSSxDQUFNO0lBRzlCLENBQUM7SUFFRCxtQ0FBUSxHQUFSO1FBQ0Usb0NBQW9DO0lBQ3RDLENBQUM7SUFyQkg7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxpQ0FBaUMsQ0FBQztTQUMvRSxDQUFDOzt3QkFBQTtJQTBCRix1QkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6Qlksd0JBQWdCLG1CQXlCNUIsQ0FBQSJ9