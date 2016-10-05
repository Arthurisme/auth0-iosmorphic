"use strict";
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
//# sourceMappingURL=login.service.js.map