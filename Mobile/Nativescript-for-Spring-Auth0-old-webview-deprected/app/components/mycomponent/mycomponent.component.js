"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var MyComponentComponent = (function () {
    function MyComponentComponent(router, page) {
        this.router = router;
        this.page = page;
    }
    MyComponentComponent = __decorate([
        core_1.Component({
            selector: "my-component",
            templateUrl: "components/mycomponent/mycomponent.html"
        }), 
        __metadata('design:paramtypes', [router_1.Router, page_1.Page])
    ], MyComponentComponent);
    return MyComponentComponent;
}());
exports.MyComponentComponent = MyComponentComponent;
//# sourceMappingURL=mycomponent.component.js.map