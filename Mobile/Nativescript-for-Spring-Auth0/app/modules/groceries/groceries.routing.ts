import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import { GroceriesComponent } from "./groceries.component";
import { AuthGuard } from "../../auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {ListComponent} from "./list/list.component";

const groceriesRoutes: Routes = [
  // { path: "groceries", component: GroceriesComponent  },
  { path: "groceries", component: LoginComponent },
  { path: "list", component: ListComponent }
];
export const groceriesRouting: ModuleWithProviders = RouterModule.forChild(groceriesRoutes);