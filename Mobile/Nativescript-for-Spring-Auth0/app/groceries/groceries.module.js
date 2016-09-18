"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var groceries_routing_1 = require("./groceries.routing");
var groceries_component_1 = require("./groceries.component");
var grocery_list_component_1 = require("./grocery-list/grocery-list.component");
var item_status_pipe_1 = require("./grocery-list/item-status.pipe");
var GroceriesModule = (function () {
    function GroceriesModule() {
    }
    GroceriesModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                groceries_routing_1.groceriesRouting
            ],
            declarations: [
                groceries_component_1.GroceriesComponent,
                grocery_list_component_1.GroceryListComponent,
                item_status_pipe_1.ItemStatusPipe
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], GroceriesModule);
    return GroceriesModule;
}());
exports.GroceriesModule = GroceriesModule;
//# sourceMappingURL=groceries.module.js.map