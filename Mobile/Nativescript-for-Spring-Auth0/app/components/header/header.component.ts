


import { Component, OnInit } from '@angular/core';
// import {Auth} from "../../auth.service";
import {Http, Headers   }      from '@angular/http';
import {Router} from "@angular/router";




@Component({
    // moduleId: module.id,
    selector: "actionbar-header",
    templateUrl: "components/header/header.component.html",
})
export class HeaderComponent   {

    constructor(
        private router:Router
        ,  private http: Http
    ) {}



    goToGroceries(){
        this.router.navigate(["/groceries"]);

    }

}
