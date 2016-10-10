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
var http_1 = require('@angular/http');
var router_1 = require("@angular/router");
var dialogs_1 = require("ui/dialogs");
var NavigateService = (function () {
    function NavigateService(router, http) {
        this.router = router;
        this.http = http;
    }
    // sendCredentials (model) {
    //     let tokenUrl = "http://localhost:8080/user/login";
    //     let headers1 = new Headers({'Content-Type': 'application/json'});
    //
    //     return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers1});
    // }
    // check if downloaded token same with server:
    NavigateService.prototype.testApiRole = function () {
        var userUrl = "http://localhost:3001/api/role/user";
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let header2 = new Headers({'Content-Type': 'application/json', 'Authorization':'Bearer '+localStorage.getItem("token")});
        var header2 = new http_1.Headers({ 'Authorization': 'Bearer ' + localStorage.getItem("id_token") });
        return this.http.get(userUrl, { headers: header2 });
        // return this.http.get(userUrl);
    };
    NavigateService.prototype.checkLogin = function () {
        if (localStorage.getItem("currentUserName") != "" && localStorage.getItem("id_token") != "") {
            return true;
        }
        else {
            return false;
        }
    };
    NavigateService.prototype.logout = function () {
        localStorage.setItem("token", "");
        localStorage.setItem("currentUserName", "");
        alert("You just logged out.");
    };
    NavigateService.prototype.goToPing = function () {
        this.router.navigate(["/ping"]);
    };
    NavigateService.prototype.goToModuleA = function () {
        this.router.navigate(["/modulea"]);
    };
    NavigateService.prototype.goToGroceries = function () {
        // this.router.navigate(["/groceries"]);
        this.router.navigate(["/grocerieslogin"]);
    };
    NavigateService.prototype.goToProfile = function () {
        this.router.navigate(["/profile"]);
    };
    NavigateService.prototype.goToAuth0login = function () {
        this.router.navigate(["/auth0login"]);
    };
    NavigateService.prototype.showMenu = function () {
        var _this = this;
        dialogs_1.action({
            message: "What would you like to do?",
            actions: ["Go to Ping", "Go to Module A", "Go to Groceries", "Go to Profile", "Go to auth0login"],
            cancelButtonText: "Cancel"
        }).then(function (result) {
            if (result === "Go to Ping") {
                _this.goToPing();
            }
            else if (result === "Go to Module A") {
                _this.goToModuleA();
            }
            else if (result === "Go to Groceries") {
                _this.goToGroceries();
            }
            else if (result === "Go to Profile") {
                _this.goToProfile();
            }
            else if (result === "Go to auth0login") {
                _this.goToAuth0login();
            }
        });
    };
    NavigateService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], NavigateService);
    return NavigateService;
}());
exports.NavigateService = NavigateService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdmlnYXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6QyxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsd0JBQXVCLFlBQVksQ0FBQyxDQUFBO0FBT3BDO0lBQ0kseUJBQ1ksTUFBYSxFQUNiLElBQVM7UUFEVCxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQ2IsU0FBSSxHQUFKLElBQUksQ0FBSztJQUNsQixDQUFDO0lBRUosNEJBQTRCO0lBQzVCLHlEQUF5RDtJQUN6RCx3RUFBd0U7SUFDeEUsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixJQUFJO0lBRUosOENBQThDO0lBQzlDLHFDQUFXLEdBQVg7UUFDSSxJQUFJLE9BQU8sR0FBRyxxQ0FBcUMsQ0FBQztRQUNwRCxrRUFBa0U7UUFHbEUsa0VBQWtFO1FBQ2xFLDRIQUE0SDtRQUM1SCxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQyxFQUFHLGVBQWUsRUFBQyxTQUFTLEdBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBQyxDQUFDLENBQUM7UUFHMUYsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBRW5ELGlDQUFpQztJQUNyQyxDQUFDO0lBRUQsb0NBQVUsR0FBVjtRQUVJLEVBQUUsQ0FBQSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBRSxFQUFFLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBRSxFQUFFLENBQUMsQ0FBQSxDQUFDO1lBQ3BGLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztR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