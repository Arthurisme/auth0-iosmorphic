"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var shared_1 = require("../shared");
var shared_2 = require("../../shared");
var GroceryListComponent = (function () {
    function GroceryListComponent(router, store) {
        this.router = router;
        this.store = store;
        this.loading = new core_1.EventEmitter();
        this.loaded = new core_1.EventEmitter();
        this.listLoaded = false;
    }
    GroceryListComponent.prototype.load = function () {
        var _this = this;
        this.loading.next("");
        this.store.load()
            .then(function () {
            _this.loaded.next("");
            _this.listLoaded = true;
        })
            .catch(function () {
            shared_2.alert("An error occurred loading your grocery list.");
        });
    };
    // The following trick makes the background color of each cell
    // in the UITableView transparent as it’s created.
    GroceryListComponent.prototype.makeBackgroundTransparent = function (args) {
        var cell = args.ios;
        if (cell) {
            cell.backgroundColor = UIColor.clearColor();
        }
    };
    GroceryListComponent.prototype.imageSource = function (grocery) {
        if (grocery.deleted) {
            return grocery.done ? "res://selected" : "res://nonselected";
        }
        return grocery.done ? "res://checked" : "res://unchecked";
    };
    GroceryListComponent.prototype.toggleDone = function (grocery) {
        this.store.toggleDoneFlag(grocery, this.showDeleted)
            .catch(function () {
            shared_2.alert("An error occurred managing your grocery list.");
        });
    };
    GroceryListComponent.prototype.delete = function (grocery) {
        this.store.setDeleteFlag(grocery)
            .catch(function () {
            shared_2.alert("An error occurred while deleting an item from your list.");
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], GroceryListComponent.prototype, "showDeleted", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GroceryListComponent.prototype, "row", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GroceryListComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GroceryListComponent.prototype, "loaded", void 0);
    GroceryListComponent = __decorate([
        core_1.Component({
            selector: "gr-grocery-list",
            templateUrl: "groceries/grocery-list/grocery-list.component.html",
            styleUrls: ["groceries/grocery-list/grocery-list.component.css"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [router_1.Router, shared_1.GroceryService])
    ], GroceryListComponent);
    return GroceryListComponent;
}());
exports.GroceryListComponent = GroceryListComponent;
//# sourceMappingURL=grocery-list.component.js.map