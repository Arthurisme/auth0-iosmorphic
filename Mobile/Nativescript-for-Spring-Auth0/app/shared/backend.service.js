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
var connectivity_1 = require("connectivity");
var Everlive = require("everlive-sdk");
var BackendService = (function () {
    function BackendService() {
        this.el = new Everlive({
            apiKey: "gwfrtxi1lwt4jcqk",
            offlineStorage: true,
            scheme: "https"
        });
        this.setupConnectionMonitoring();
    }
    BackendService.prototype.setupConnectionMonitoring = function () {
        var _this = this;
        this.handleOnlineOffline();
        this.lastOnlineState = connectivity_1.getConnectionType();
        connectivity_1.startMonitoring(function () {
            _this.handleOnlineOffline();
            // If the user comes back online sync any changes they
            // made while offline.
            if (connectivity_1.getConnectionType() !== connectivity_1.connectionType.none
                && _this.lastOnlineState === connectivity_1.connectionType.none) {
                _this.el.sync();
            }
            _this.lastOnlineState = connectivity_1.getConnectionType();
        });
    };
    BackendService.prototype.handleOnlineOffline = function () {
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            this.el.offline();
        }
        else {
            this.el.online();
        }
    };
    BackendService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], BackendService);
    return BackendService;
}());
exports.BackendService = BackendService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFFM0MsNkJBQW1FLGNBQWMsQ0FBQyxDQUFBO0FBRWxGLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUd6QztJQVNFO1FBUkEsT0FBRSxHQUFHLElBQUksUUFBUSxDQUFDO1lBQ2hCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsY0FBYyxFQUFFLElBQUk7WUFDcEIsTUFBTSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO1FBS0QsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELGtEQUF5QixHQUF6QjtRQUFBLGlCQWVDO1FBZEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxnQ0FBaUIsRUFBRSxDQUFDO1FBQzNDLDhCQUFlLENBQUM7WUFDZCxLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUUzQixzREFBc0Q7WUFDdEQsc0JBQXNCO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLGdDQUFpQixFQUFFLEtBQUssNkJBQWMsQ0FBQyxJQUFJO21CQUMxQyxLQUFJLENBQUMsZUFBZSxLQUFLLDZCQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsS0FBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNqQixDQUFDO1lBRUQsS0FBSSxDQUFDLGVBQWUsR0FBRyxnQ0FBaUIsRUFBRSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLDRDQUFtQixHQUEzQjtRQUNFLEVBQUUsQ0FBQyxDQUFDLGdDQUFpQixFQUFFLEtBQUssNkJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQXJDSDtRQUFDLGlCQUFVLEVBQUU7O3NCQUFBO0lBc0NiLHFCQUFDO0FBQUQsQ0FBQyxBQXJDRCxJQXFDQztBQXJDWSxzQkFBYyxpQkFxQzFCLENBQUEifQ==