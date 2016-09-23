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
var LoginComponent = (function () {
    function LoginComponent(router, userService, page) {
        this.router = router;
        this.userService = userService;
        this.page = page;
        this.isLoggingIn = true;
        this.isAuthenticating = false;
        this.user = new shared_1.User();
        this.user.email = "user@nativescript.org";
        this.user.password = "password";
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    LoginComponent.prototype.focusPassword = function () {
        this.password.nativeElement.focus();
    };
    LoginComponent.prototype.submit = function () {
        if (!this.user.isValidEmail()) {
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
    LoginComponent.prototype.login = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            shared_1.alert("Groceries requires an internet connection to log in.");
            return;
        }
        this.userService.login(this.user)
            .then(function () {
            _this.isAuthenticating = false;
            _this.router.navigate(["/"]);
        })
            .catch(function () {
            shared_1.alert("Unfortunately we could not find your account.");
            _this.isAuthenticating = false;
        });
    };
    LoginComponent.prototype.signUp = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            shared_1.alert("Groceries requires an internet connection to register.");
            return;
        }
        this.userService.register(this.user)
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
    LoginComponent.prototype.forgotPassword = function () {
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
    LoginComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
        this.setTextFieldColors();
        var mainContainer = this.mainContainer.nativeElement;
        mainContainer.animate({
            backgroundColor: this.isLoggingIn ? new color_1.Color("white") : new color_1.Color("#301217"),
            duration: 200
        });
    };
    LoginComponent.prototype.startBackgroundAnimation = function (background) {
        background.animate({
            scale: { x: 1.0, y: 1.0 },
            duration: 10000
        });
    };
    LoginComponent.prototype.showMainContent = function () {
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
    LoginComponent.prototype.setTextFieldColors = function () {
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
    ], LoginComponent.prototype, "initialContainer", void 0);
    __decorate([
        core_1.ViewChild("mainContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "mainContainer", void 0);
    __decorate([
        core_1.ViewChild("logoContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "logoContainer", void 0);
    __decorate([
        core_1.ViewChild("formControls"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "formControls", void 0);
    __decorate([
        core_1.ViewChild("signUpStack"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "signUpStack", void 0);
    __decorate([
        core_1.ViewChild("email"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "email", void 0);
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "password", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: "gr-login",
            templateUrl: "login/login.component.html",
            styleUrls: ["login/login-common.css", "login/login.component.css"],
        }), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.LoginService, page_1.Page])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBeUQsZUFBZSxDQUFDLENBQUE7QUFDekUsdUJBQXVCLGlCQUFpQixDQUFDLENBQUE7QUFDekMsc0JBQXNCLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLDZCQUFrRCxjQUFjLENBQUMsQ0FBQTtBQUNqRSwwQkFBMEIsY0FBYyxDQUFDLENBQUE7QUFFekMsd0JBQXVCLFlBQVksQ0FBQyxDQUFBO0FBQ3BDLHFCQUFxQixTQUFTLENBQUMsQ0FBQTtBQUcvQix1QkFBd0QsV0FBVyxDQUFDLENBQUE7QUFPcEU7SUFhRSx3QkFBb0IsTUFBYyxFQUN4QixXQUF5QixFQUN6QixJQUFVO1FBRkEsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYztRQUN6QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBYnBCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQWF2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksYUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQXVCLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxpQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ25DLENBQUM7SUFFRCxzQ0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELCtCQUFNLEdBQU47UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENB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