import {Component} from '@angular/core';
// import {ROUTER_DIRECTIVES} from "@angular/router";
import { Router }   from '@angular/router';

import {LoginService} from "../../services/login.service";



@Component({
    selector: 'nav-bar',
    // directives:[ROUTER_DIRECTIVES],
    templateUrl: `nav-bar.component.html`,
    // styleUrls: [ '../../../resources/css/semantic.css', '../../../resources/css/modules/photo.css' ],

})
export class NavBar {

    constructor(private loginService: LoginService){}

    onClick(){
        if(this.loginService.checkLogin()){
           this.loginService.logout();
        }
    }
}
