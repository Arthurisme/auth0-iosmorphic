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
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var groceries_routing_1 = require("./groceries.routing");
var groceries_component_1 = require("./groceries.component");
var grocery_list_component_1 = require("./grocery-list/grocery-list.component");
var item_status_pipe_1 = require("./grocery-list/item-status.pipe");
var shared_module_1 = require("../shared/shared.module");
var GroceriesModule = (function () {
    function GroceriesModule() {
    }
    GroceriesModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUFtQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ25FLHNCQUF3Qyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3JFLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6QyxrQ0FBaUMscUJBQXFCLENBQUMsQ0FBQTtBQUN2RCxvQ0FBbUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMzRCx1Q0FBcUMsdUNBQXVDLENBQUMsQ0FBQTtBQUM3RSxpQ0FBK0IsaUNBQWlDLENBQUMsQ0FBQTtBQUNqRSw4QkFBMkIseUJBQXlCLENBQUMsQ0FBQTtBQWlCckQ7SUFBQTtJQUE4QixDQUFDO0lBZi9CO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDRCQUFZO2dCQUdaLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2QixvQ0FBZ0I7YUFDakI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osd0NBQWtCO2dCQUNsQiw2Q0FBb0I7Z0JBQ3BCLGlDQUFjO2FBQ2Y7U0FDRixDQUFDOzt1QkFBQTtJQUM0QixzQkFBQztBQUFELENBQUMsQUFBL0IsSUFBK0I7QUFBbEIsdUJBQWUsa0JBQUcsQ0FBQSJ9