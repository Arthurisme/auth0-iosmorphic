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
var dialogs_1 = require("ui/dialogs");
var color_1 = require("color");
var page_1 = require("ui/page");
var SocialShare = require("nativescript-social-share");
var shared_1 = require("./shared");
var shared_2 = require("../shared");
var navigate_service_1 = require("../shared/service/navigate.service");
var GroceriesComponent = (function () {
    function GroceriesComponent(router, store, loginService, page, navigateService) {
        this.router = router;
        this.store = store;
        this.loginService = loginService;
        this.page = page;
        this.navigateService = navigateService;
        this.grocery = "";
        this.isShowingRecent = false;
        this.isLoading = false;
    }
    GroceriesComponent.prototype.ngOnInit = function () {
        this.isAndroid = !!this.page.android;
        // this.page.actionBarHidden = true;
        this.page.className = "list-page";
    };
    GroceriesComponent.prototype.setTextFieldHintColor = function (textField) {
        // TODO: Why is it necessary to defer this code on iOS?
        // It should work without the setTimeout like it does on Android.
        setTimeout(function () {
            shared_2.setHintColor({
                view: textField,
                color: new color_1.Color("white")
            });
        });
    };
    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    GroceriesComponent.prototype.handleAndroidFocus = function (textField, container) {
        if (container.android) {
            container.android.setFocusableInTouchMode(true);
            container.android.setFocusable(true);
            textField.android.clearFocus();
        }
    };
    GroceriesComponent.prototype.showActivityIndicator = function () {
        this.isLoading = true;
    };
    GroceriesComponent.prototype.hideActivityIndicator = function () {
        this.isLoading = false;
    };
    GroceriesComponent.prototype.add = function (target) {
        // If showing recent groceries the add button should do nothing.
        if (this.isShowingRecent) {
            return;
        }
        var textField = this.groceryTextField.nativeElement;
        if (this.grocery.trim() === "") {
            // If the user clicked the add button, and the textfield is empty,
            // focus the text field and return.
            if (target === "button") {
                textField.focus();
            }
            else {
                // If the user clicked return with an empty text field show an error.
                shared_2.alert("Enter a grocery item");
            }
            return;
        }
        // Dismiss the keyboard
        // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
        // user can continue to add more groceries?
        textField.dismissSoftInput();
        this.store.add(this.grocery)
            .catch(function () {
            shared_2.alert("An error occurred while adding an item to your list.");
        });
        this.grocery = "";
    };
    GroceriesComponent.prototype.toggleRecent = function () {
        if (!this.isShowingRecent) {
            this.isShowingRecent = true;
            return;
        }
        this.store.restore()
            .catch(function () {
            shared_2.alert("An error occurred while adding groceries to your list.");
        });
        this.isShowingRecent = false;
    };
    GroceriesComponent.prototype.showMenu = function () {
        var _this = this;
        dialogs_1.action({
            message: "What would you like to do?",
            actions: ["Share", "Log Off"],
            cancelButtonText: "Cancel"
        }).then(function (result) {
            if (result === "Share") {
                _this.share();
            }
            else if (result === "Log Off") {
                _this.logoff();
            }
        });
    };
    GroceriesComponent.prototype.share = function () {
        var items = this.store.items.value;
        var list = [];
        for (var i = 0, size = items.length; i < size; i++) {
            list.push(items[i].name);
        }
        SocialShare.shareText(list.join(", ").trim());
    };
    GroceriesComponent.prototype.logoff = function () {
        this.loginService.logoff();
        this.router.navigate(["/login"]);
    };
    __decorate([
        core_1.ViewChild("groceryTextField"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesComponent.prototype, "groceryTextField", void 0);
    GroceriesComponent = __decorate([
        core_1.Component({
            selector: "gr-groceries",
            templateUrl: "groceries/groceries.component.html",
            styleUrls: ["groceries/groceries-common.css", "groceries/groceries.component.css"],
            providers: [shared_1.GroceryService]
        }), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.GroceryService, shared_2.LoginService, page_1.Page, navigate_service_1.NavigateService])
    ], GroceriesComponent);
    return GroceriesComponent;
}());
exports.GroceriesComponent = GroceriesComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5RCxlQUFlLENBQUMsQ0FBQTtBQUN6RSx1QkFBdUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN6Qyx3QkFBdUIsWUFBWSxDQUFDLENBQUE7QUFDcEMsc0JBQXNCLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLHFCQUFxQixTQUFTLENBQUMsQ0FBQTtBQUUvQixJQUFZLFdBQVcsV0FBTSwyQkFBMkIsQ0FBQyxDQUFBO0FBR3pELHVCQUErQixVQUFVLENBQUMsQ0FBQTtBQUMxQyx1QkFBa0QsV0FBVyxDQUFDLENBQUE7QUFDOUQsaUNBQThCLG9DQUFvQyxDQUFDLENBQUE7QUFRbkU7SUFRRSw0QkFBb0IsTUFBYyxFQUN4QixLQUFxQixFQUNyQixZQUEwQixFQUMxQixJQUFVLEVBQ1YsZUFBK0I7UUFKckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1Ysb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBWHpDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFFckIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsY0FBUyxHQUFHLEtBQUssQ0FBQztJQVNmLENBQUM7SUFFSixxQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDckMsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztJQUlwQyxDQUFDO0lBRUQsa0RBQXFCLEdBQXJCLFVBQXNCLFNBQVM7UUFDN0IsdURBQXVEO1FBQ3ZELGlFQUFpRTtRQUNqRSxV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