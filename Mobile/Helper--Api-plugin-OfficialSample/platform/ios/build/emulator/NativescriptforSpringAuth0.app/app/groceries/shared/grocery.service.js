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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyeS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvY2VyeS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBbUMsZUFBZSxDQUFDLENBQUE7QUFDbkQsbUJBQWdDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLHVCQUErQixjQUFjLENBQUMsQ0FBQTtBQUM5Qyw4QkFBd0IsaUJBQWlCLENBQUMsQ0FBQTtBQUcxQztJQUtFLHdCQUFvQixJQUFZLEVBQVUsT0FBdUI7UUFBN0MsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSmpFLFVBQUssR0FBb0MsSUFBSSxvQkFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpELGFBQVEsR0FBbUIsRUFBRSxDQUFDO0lBRStCLENBQUM7SUFFdEUsNkJBQUksR0FBSjtRQUFBLGlCQVlDO1FBWEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLEtBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7Z0JBQzVCLEtBQUksQ0FBQyxTQUFTLEVBQUU7cUJBQ2IsSUFBSSxDQUFDLGNBQVEsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzFCLEtBQUssQ0FBQyxjQUFRLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxrQ0FBUyxHQUFqQjtRQUFBLGlCQW9CQztR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