"use strict";
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var shared_1 = require("../../shared");
var grocery_model_1 = require("./grocery.model");
var GroceryService = (function () {
    function GroceryService(zone, backend) {
        this.zone = zone;
        this.backend = backend;
        this.items = new Rx_1.BehaviorSubject([]);
        this.allItems = [];
    }
    GroceryService.prototype.load = function () {
        var _this = this;
        if (!this.backend.el.offlineStorage.isSynchronizing()) {
            return this.loadItems();
        }
        return new Promise(function (resolve, reject) {
            _this.backend.el.on("syncEnd", function () {
                _this.loadItems()
                    .then(function () { resolve(); })
                    .catch(function () { reject(); });
            });
        });
    };
    GroceryService.prototype.loadItems = function () {
        var _this = this;
        return this.backend.el.data("Groceries")
            .withHeaders({ "X-Everlive-Sort": JSON.stringify({ ModifiedAt: -1 }) })
            .get()
            .then(function (data) {
            data.result.forEach(function (grocery) {
                _this.allItems.push(new grocery_model_1.Grocery(grocery.Id, grocery.Name, grocery.Done || false, grocery.Deleted || false));
            });
            _this.publishUpdates();
            return Promise.resolve(_this.allItems);
        })
            .catch(this.handleErrors);
    };
    GroceryService.prototype.add = function (name) {
        var newGrocery = new grocery_model_1.Grocery("", name, false, false);
        this.allItems.unshift(newGrocery);
        this.publishUpdates();
        return this.backend.el.data("Groceries")
            .create({ Name: name })
            .then(function (data) {
            newGrocery.id = data.result.Id;
            return Promise.resolve(newGrocery);
        })
            .catch(this.handleErrors);
    };
    GroceryService.prototype.setDeleteFlag = function (item) {
        var newItem = new grocery_model_1.Grocery(item.id, item.name, false, true);
        this.updateSingleItem(item, newItem);
        this.publishUpdates();
        return this.syncItem(newItem);
    };
    GroceryService.prototype.toggleDoneFlag = function (item, skipSync) {
        if (skipSync === void 0) { skipSync = false; }
        var newItem = new grocery_model_1.Grocery(item.id, item.name, !item.done, item.deleted);
        this.updateSingleItem(item, newItem);
        this.publishUpdates();
        if (skipSync) {
            return Promise.resolve(true);
        }
        else {
            return this.syncItem(newItem);
        }
    };
    GroceryService.prototype.restore = function () {
        var indeces = [];
        this.allItems.forEach(function (grocery) {
            if (grocery.deleted && grocery.done) {
                grocery.done = false;
                grocery.deleted = false;
                indeces.push(grocery.id);
            }
        });
        var headers = {
            "X-Everlive-Filter": JSON.stringify({
                "Id": { "$in": indeces }
            })
        };
        this.publishUpdates();
        return this.backend.el.data("Groceries")
            .withHeaders(headers)
            .update({ Deleted: false, Done: false })
            .catch(this.handleErrors);
    };
    GroceryService.prototype.updateSingleItem = function (item, newItem) {
        var index = this.allItems.indexOf(item);
        this.allItems.splice(index, 1, newItem);
    };
    GroceryService.prototype.syncItem = function (item) {
        return this.backend.el.data("Groceries")
            .updateSingle({ Id: item.id, Name: item.name, Deleted: item.deleted, Done: item.done })
            .catch(this.handleErrors);
    };
    GroceryService.prototype.publishUpdates = function () {
        var _this = this;
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this.zone.run(function () {
            // must emit a *new* value (immutability!)
            _this.items.next(_this.allItems.slice());
        });
    };
    GroceryService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    GroceryService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.NgZone, shared_1.BackendService])
    ], GroceryService);
    return GroceryService;
}());
exports.GroceryService = GroceryService;
//# sourceMappingURL=grocery.service.js.map