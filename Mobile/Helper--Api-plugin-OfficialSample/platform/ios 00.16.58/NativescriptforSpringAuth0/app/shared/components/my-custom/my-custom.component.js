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
var router_1 = require("@angular/router");
var MyCustomComponent = (function () {
    function MyCustomComponent(router) {
        this.router = router;
    }
    MyCustomComponent.prototype.goToTest = function () {
        console.log("test shared custom component");
        //rc6:
        var link = ['/profile'];
        this.router.navigate(link);
        // //Test for router rc7 function:
        // this.router.navigate(['image-detail/1']);
    };
    MyCustomComponent.prototype.goToGroceries = function () {
        this.router.navigate(["/groceries"]);
    };
    MyCustomComponent.prototype.goToPing = function () {
        this.router.navigate(["/ping"]);
    };
    MyCustomComponent.prototype.goToModuleA = function () {
        this.router.navigate(["/modulea"]);
    };
    MyCustomComponent = __decorate([
        core_1.Component({
            selector: 'arthur-my-custom',
            templateUrl: 'shared/components/my-custom/my-custom.component.html',
            styleUrls: ["shared/components/my-custom/my-custom-common.css", "shared/components/my-custom/my-custom.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], MyCustomComponent);
    return MyCustomComponent;
}());
exports.MyCustomComponent = MyCustomComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY3VzdG9tLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWN1c3RvbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUEwQixlQUFlLENBQUMsQ0FBQTtBQUMxQyx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQVN2QztJQUVFLDJCQUE2QixNQUFhO1FBQWIsV0FBTSxHQUFOLE1BQU0sQ0FBTztJQUN2QyxDQUFDO0lBR0osb0NBQVEsR0FBUjtRQUVFLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUc1QyxNQUFNO1FBQ04sSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQixrQ0FBa0M7UUFDbEMsNENBQTRDO0lBRTlDLENBQUM7SUFJRCx5Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBRXZDLENBQUM7SUFFRCxvQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUF2Q0g7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixXQUFXLEVBQUUsc0RBQXNEO1lBQ25FLFNBQVMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLHFEQUFxRCxDQUFDO1NBRXZILENBQUM7O3lCQUFBO0lBb0NGLHdCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQW5DWSx5QkFBaUIsb0JBbUM3QixDQUFBIn0=