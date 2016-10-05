"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var groceries_routing_1 = require("./groceries.routing");
// import {HeaderComponent} from "../../components/header/header.component";
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";
var login_component_1 = require("./login/login.component");
var list_component_1 = require("./list/list.component");
// import { GroceriesComponent } from "./groceries.component";
// import { GroceryListComponent } from "./grocery-list/grocery-list.component";
// import { ItemStatusPipe } from "./grocery-list/item-status.pipe";
var GroceriesModule = (function () {
    function GroceriesModule() {
    }
    GroceriesModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                groceries_routing_1.groceriesRouting
            ],
            declarations: [
                // HeaderComponent,
                // MyComponentComponent,
                login_component_1.LoginComponent,
                list_component_1.ListComponent,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], GroceriesModule);
    return GroceriesModule;
}());
exports.GroceriesModule = GroceriesModule;
//# sourceMappingURL=groceries.module.js.map