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
var color_1 = require("color");
var connectivity_1 = require("connectivity");
var animation_1 = require("ui/animation");
var dialogs_1 = require("ui/dialogs");
var page_1 = require("ui/page");
var shared_1 = require("../shared");
var navigate_service_1 = require("../shared/service/navigate.service");
var GroceriesLoginComponent = (function () {
    function GroceriesLoginComponent(router, userService, navigateService, page) {
        this.router = router;
        this.userService = userService;
        this.navigateService = navigateService;
        this.page = page;
        this.isLoggingIn = true;
        this.isAuthenticating = false;
        this.groceriesUser = new shared_1.GroceriesUser();
        this.groceriesUser.email = "user@nativescript.org";
        this.groceriesUser.password = "password";
    }
    GroceriesLoginComponent.prototype.ngOnInit = function () {
        // this.page.actionBarHidden = true;
    };
    GroceriesLoginComponent.prototype.focusPassword = function () {
        this.password.nativeElement.focus();
    };
    GroceriesLoginComponent.prototype.submit = function () {
        if (!this.groceriesUser.isValidEmail()) {
            shared_1.alert("Enter a valid email address.");
            return;
        }
        this.isAuthenticating = true;
        if (this.isLoggingIn) {
            this.login();
        }
        else {
            this.signUp();
        }
    };
    GroceriesLoginComponent.prototype.login = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            shared_1.alert("Groceries requires an internet connection to log in.");
            return;
        }
        this.userService.login(this.groceriesUser)
            .then(function () {
            _this.isAuthenticating = false;
            _this.router.navigate(["/groceries"]);
        })
            .catch(function () {
            shared_1.alert("Unfortunately we could not find your account.");
            _this.isAuthenticating = false;
        });
    };
    GroceriesLoginComponent.prototype.signUp = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            shared_1.alert("Groceries requires an internet connection to register.");
            return;
        }
        this.userService.register(this.groceriesUser)
            .then(function () {
            shared_1.alert("Your account was successfully created.");
            _this.isAuthenticating = false;
            _this.toggleDisplay();
        })
            .catch(function (message) {
            if (message.match(/same user/)) {
                shared_1.alert("This email address is already in use.");
            }
            else {
                shared_1.alert("Unfortunately we were unable to create your account.");
            }
            _this.isAuthenticating = false;
        });
    };
    GroceriesLoginComponent.prototype.forgotPassword = function () {
        var _this = this;
        dialogs_1.prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for Groceries to reset your password.",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then(function (data) {
            if (data.result) {
                _this.userService.resetPassword(data.text.trim())
                    .then(function () {
                    shared_1.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                })
                    .catch(function () {
                    shared_1.alert("Unfortunately, an error occurred resetting your password.");
                });
            }
        });
    };
    GroceriesLoginComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
        this.setTextFieldColors();
        var mainContainer = this.mainContainer.nativeElement;
        mainContainer.animate({
            backgroundColor: this.isLoggingIn ? new color_1.Color("white") : new color_1.Color("#301217"),
            duration: 200
        });
    };
    GroceriesLoginComponent.prototype.startBackgroundAnimation = function (background) {
        background.animate({
            scale: { x: 1.0, y: 1.0 },
            duration: 10000
        });
    };
    GroceriesLoginComponent.prototype.showMainContent = function () {
        var initialContainer = this.initialContainer.nativeElement;
        var mainContainer = this.mainContainer.nativeElement;
        var logoContainer = this.logoContainer.nativeElement;
        var formControls = this.formControls.nativeElement;
        var signUpStack = this.signUpStack.nativeElement;
        var animations = [];
        // Fade out the initial content over one half second
        initialContainer.animate({
            opacity: 0,
            duration: 500
        }).then(function () {
            // After the animation completes, hide the initial container and
            // show the main container and logo. The main container and logo will
            // not immediately appear because their opacity is set to 0 in CSS.
            initialContainer.style.visibility = "collapse";
            mainContainer.style.visibility = "visible";
            logoContainer.style.visibility = "visible";
            // Fade in the main container and logo over one half second.
            animations.push({ target: mainContainer, opacity: 1, duration: 500 });
            animations.push({ target: logoContainer, opacity: 1, duration: 500 });
            // Slide up the form controls and sign up container.
            animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
            animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });
            // Kick off the animation queue
            new animation_1.Animation(animations, false).play();
        });
    };
    GroceriesLoginComponent.prototype.setTextFieldColors = function () {
        var emailTextField = this.email.nativeElement;
        var passwordTextField = this.password.nativeElement;
        var mainTextColor = new color_1.Color(this.isLoggingIn ? "black" : "#C4AFB4");
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;
        var hintColor = new color_1.Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
        shared_1.setHintColor({ view: emailTextField, color: hintColor });
        shared_1.setHintColor({ view: passwordTextField, color: hintColor });
    };
    __decorate([
        core_1.ViewChild("initialContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "initialContainer", void 0);
    __decorate([
        core_1.ViewChild("mainContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "mainContainer", void 0);
    __decorate([
        core_1.ViewChild("logoContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "logoContainer", void 0);
    __decorate([
        core_1.ViewChild("formControls"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "formControls", void 0);
    __decorate([
        core_1.ViewChild("signUpStack"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "signUpStack", void 0);
    __decorate([
        core_1.ViewChild("email"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "email", void 0);
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], GroceriesLoginComponent.prototype, "password", void 0);
    GroceriesLoginComponent = __decorate([
        core_1.Component({
            selector: "gr-login",
            templateUrl: "groceries-login/groceries-login.component.html",
            styleUrls: ["groceries-login/groceries-login-common.css", "groceries-login/groceries-login.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.LoginService, navigate_service_1.NavigateService, page_1.Page])
    ], GroceriesLoginComponent);
    return GroceriesLoginComponent;
}());
exports.GroceriesLoginComponent = GroceriesLoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLWxvZ2luLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy1sb2dpbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5RCxlQUFlLENBQUMsQ0FBQTtBQUN6RSx1QkFBdUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN6QyxzQkFBc0IsT0FBTyxDQUFDLENBQUE7QUFDOUIsNkJBQWtELGNBQWMsQ0FBQyxDQUFBO0FBQ2pFLDBCQUEwQixjQUFjLENBQUMsQ0FBQTtBQUV6Qyx3QkFBdUIsWUFBWSxDQUFDLENBQUE7QUFDcEMscUJBQXFCLFNBQVMsQ0FBQyxDQUFBO0FBRy9CLHVCQUFpRSxXQUFXLENBQUMsQ0FBQTtBQUM3RSxpQ0FBOEIsb0NBQW9DLENBQUMsQ0FBQTtBQU9uRTtJQWFFLGlDQUFvQixNQUFjLEVBQ3hCLFdBQXlCLEVBQ3pCLGVBQStCLEVBQy9CLElBQVU7UUFIQSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUFjO1FBQ3pCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBZHBCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQWN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksc0JBQWEsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsMENBQVEsR0FBUjtRQUNFLG9DQUFvQztJQUN0QyxDQUFDO0lBRUQsK0NBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCx3Q0FBTSxHQUFO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