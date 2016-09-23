import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { NgModule } from "@angular/core";
import { groceriesRouting } from "./groceries.routing";

// import {HeaderComponent} from "../../components/header/header.component";
// import {MyComponentComponent} from "../../components/mycomponent/mycomponent.component";



import {LoginComponent} from "./login/login.component";
import {ListComponent} from "./list/list.component";
import {MyComponentbComponent} from "../my-componentb/my-componentb.component";
// import { GroceriesComponent } from "./groceries.component";
// import { GroceryListComponent } from "./grocery-list/grocery-list.component";
// import { ItemStatusPipe } from "./grocery-list/item-status.pipe";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    groceriesRouting
  ],
  declarations: [
    // HeaderComponent,
    // MyComponentComponent,
    LoginComponent,
    ListComponent,
    // MyComponentbComponent,

    // ItemStatusPipe
  ]
})
export class GroceriesModule {}
