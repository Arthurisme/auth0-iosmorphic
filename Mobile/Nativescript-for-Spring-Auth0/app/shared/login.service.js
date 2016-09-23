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
var application_settings_1 = require("application-settings");
var backend_service_1 = require("./backend.service");
var tokenKey = "token";
var LoginService = (function () {
    function LoginService(backend) {
        this.backend = backend;
        if (this.token) {
            this.backend.el.authentication.setAuthorization(this.token, "bearer");
        }
    }
    Object.defineProperty(LoginService.prototype, "isLoggedIn", {
        get: function () {
            return !!application_settings_1.getString(tokenKey);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginService.prototype, "token", {
        get: function () {
            return application_settings_1.getString(tokenKey);
        },
        set: function (theToken) {
            application_settings_1.setString(tokenKey, theToken);
        },
        enumerable: true,
        configurable: true
    });
    LoginService.prototype.register = function (user) {
        return this.backend.el.Users.register(user.email, user.password)
            .catch(this.handleErrors);
    };
    LoginService.prototype.login = function (user) {
        var _this = this;
        return this.backend.el.authentication.login(user.email, user.password).then(function (data) {
            _this.token = data.result.access_token;
            _this.backend.el.authentication.setAuthorization(_this.token, "bearer");
            return Promise.resolve();
        }).catch(this.handleErrors);
    };
    LoginService.prototype.logoff = function () {
        this.backend.el.authentication.clearAuthorization();
        this.token = "";
    };
    LoginService.prototype.resetPassword = function (email) {
        return this.backend.el.Users.resetPassword({ Username: email })
            .catch(this.handleErrors);
    };
    LoginService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [backend_service_1.BackendService])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyxxQ0FBcUMsc0JBQXNCLENBQUMsQ0FBQTtBQUc1RCxnQ0FBK0IsbUJBQW1CLENBQUMsQ0FBQTtBQUVuRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFHekI7SUFZRSxzQkFBb0IsT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RSxDQUFDO0lBQ0gsQ0FBQztJQWZELHNCQUFJLG9DQUFVO2FBQWQ7WUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGdDQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSwrQkFBSzthQUFqQjtZQUNFLE1BQU0sQ0FBQyxnQ0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLENBQUM7YUFDRCxVQUFrQixRQUFnQjtZQUNoQyxnQ0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDOzs7T0FIQTtJQVdELCtCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM3RCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCw0QkFBSyxHQUFMLFVBQU0sSUFBVTtRQUFoQixpQkFNQztRQUxDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUk7WUFDL0UsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUN0QyxLQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELDZCQUFNLEdBQU47UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsb0NBQWEsR0FBYixVQUFjLEtBQUs7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7YUFDNUQsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsbUNBQVksR0FBWixVQUFhLEtBQUs7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUE3Q0g7UUFBQyxpQkFBVSxFQUFFOztvQkFBQTtJQThDYixtQkFBQztBQUFELENBQUMsQUE3Q0QsSUE2Q0M7QUE3Q1ksb0JBQVksZUE2Q3hCLENBQUEifQ==