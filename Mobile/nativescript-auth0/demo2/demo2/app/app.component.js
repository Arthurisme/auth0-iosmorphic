"use strict";
var core_1 = require("@angular/core");
var auth0 = require("nativescript-auth0");
var application = require("application");
var appSettings = require("application-settings");
var AppComponent = (function () {
    function AppComponent() {
        this.counter = 16;
    }
    AppComponent.prototype.login = function () {
        console.log("TTTTT");
        auth0.show().then(function (args) {
            console.log(args.profile);
            console.log(args.token);
            appSettings.setString("UserData", JSON.stringify(args));
        });
    };
    AppComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(AppComponent.prototype, "message", {
        get: function () {
            if (this.counter > 0) {
                return this.counter + " taps left";
            }
            else {
                return "Hoorraaay! \nYou are ready to start building!";
            }
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.onTap = function () {
        this.counter--;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "app.component.html",
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map