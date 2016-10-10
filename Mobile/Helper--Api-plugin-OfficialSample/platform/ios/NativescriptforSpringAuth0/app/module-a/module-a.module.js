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
var module_a_routing_1 = require("./module-a.routing");
var module_a_component_1 = require("./module-a.component");
var shared_module_1 = require("../shared/shared.module");
var ModuleAModule = (function () {
    function ModuleAModule() {
    }
    ModuleAModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                module_a_routing_1.moduleARouting
            ],
            declarations: [
                module_a_component_1.ModuleAComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ModuleAModule);
    return ModuleAModule;
}());
exports.ModuleAModule = ModuleAModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLWEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLWEubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5QkFBbUMsK0JBQStCLENBQUMsQ0FBQTtBQUNuRSxzQkFBd0MsNEJBQTRCLENBQUMsQ0FBQTtBQUNyRSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFFekMsaUNBQStCLG9CQUFvQixDQUFDLENBQUE7QUFDcEQsbUNBQWlDLHNCQUFzQixDQUFDLENBQUE7QUFDeEQsOEJBQTJCLHlCQUF5QixDQUFDLENBQUE7QUFlckQ7SUFBQTtJQUE2QixDQUFDO0lBYjlCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDRCQUFZO2dCQUdaLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2QixpQ0FBYzthQUNmO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLHFDQUFnQjthQUNqQjtTQUNGLENBQUM7O3FCQUFBO0lBQzJCLG9CQUFDO0FBQUQsQ0FBQyxBQUE5QixJQUE4QjtBQUFqQixxQkFBYSxnQkFBSSxDQUFBIn0=