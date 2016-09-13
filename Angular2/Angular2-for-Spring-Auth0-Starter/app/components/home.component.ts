import {Component} from '@angular/core';
import {PhotoList} from './photo-list.component';
import {SidePanel} from './side-panel.component';
import {flattenStyles} from "@angular/compiler/core_private";
import {ApiTestService} from "../services/apitest.service";
import {Router} from '@angular/router-deprecated';
import {UserService} from "../services/user.service";



@Component({
    selector: 'home',
    directives:[PhotoList,SidePanel],
    templateUrl: `app/components/home.component.html`
})
export class HomeComponent {

    hasThisRole:boolean;

    constructor(private apiTestService: ApiTestService,private router: Router, private userService:UserService
    ){}

    onClick(){

        // this.hasThisRole = false;



        this.apiTestService.testApiRole().subscribe(
            booleanData => {
                this.hasThisRole  = JSON.parse(JSON.parse(JSON.stringify(booleanData))._body);
            },
            error => console.log(error)
        );

    }

    binding(){
        this.userService.bindingUserToSpring();
    }
}
