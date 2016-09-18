"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dialogs_1 = require("ui/dialogs");
var color_1 = require("color");
var page_1 = require("ui/page");
var SocialShare = require("nativescript-social-share");
var shared_1 = require("./shared");
var shared_2 = require("../shared");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var GroceriesComponent = (function () {
    function GroceriesComponent(router, store, loginService, page) {
        this.router = router;
        this.store = store;
        this.loginService = loginService;
        this.page = page;
        this.grocery = "";
        this.isShowingRecent = false;
        this.isLoading = false;
    }
    GroceriesComponent.prototype.ngOnInit = function () {
        this.isAndroid = !!this.page.android;
        this.page.actionBarHidden = true;
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
    GroceriesComponent.prototype.gotoAuth0Login = function () {
        this.router.navigate(["/auth0login"]);
    };
    GroceriesComponent.prototype.doLogout = function () {
        appSettings.remove("auth0Token");
        appSettings.remove("auth0UserData");
        this.router.navigate(["/auth0testpage"]);
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
        __metadata('design:paramtypes', [router_1.Router, shared_1.GroceryService, shared_2.LoginService, page_1.Page])
    ], GroceriesComponent);
    return GroceriesComponent;
}());
exports.GroceriesComponent = GroceriesComponent;
//# sourceMappingURL=groceries.component.js.map