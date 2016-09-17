"use strict";
var ShoppingListService = (function () {
    function ShoppingListService() {
        this.items = [];
    }
    ShoppingListService.prototype.getItems = function () {
        return this.items;
    };
    ShoppingListService.prototype.addItems = function (items) {
        Array.prototype.push.apply(this.items, items);
    };
    return ShoppingListService;
}());
exports.ShoppingListService = ShoppingListService;
//# sourceMappingURL=../../../app/shopping-list/shopping-list.service.js.map