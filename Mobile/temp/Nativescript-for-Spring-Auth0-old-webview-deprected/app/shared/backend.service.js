"use strict";
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
//# sourceMappingURL=backend.service.js.map