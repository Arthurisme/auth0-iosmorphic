import {RouterConfig} from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router";
import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";
import {PagetwoPage} from "./pages/pagetwo/pagetwo.component";




export const routes: RouterConfig =[
    {path: "", component:LoginPage},
    {path: "list", component:ListPage},
    {path: "pagetwo", component:PagetwoPage}
];

export const APP_ROUTER_PROVIDERS =[
    nsProvideRouter(routes,{})
];