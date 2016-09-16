import {Component} from '@angular/core';
import {PhotoList} from '../photo-list/photo-list.component';
import {SidePanel} from '../side-panel/side-panel.component';
// import {flattenStyles} from "@angular/compiler/core_private";
import {ApiTestService} from "../../../services/apitest.service";
import {Router} from '@angular/router';
import {UserService} from "../../../services/user.service";



@Component({
    selector: 'photohome',
    // directives:[PhotoList,SidePanel],
    templateUrl: './photo-home.component.html',
    // styleUrls: [ '../../../resources/css/semantic.css', '../../../resources/css/modules/photo.css' ],

})
export class PhotoHomeComponent {

    hasThisRole:boolean;

    constructor(private apiTestService: ApiTestService,private router: Router, private userService:UserService
    ){}







    //test:
    onClickTest(){

        // this.hasThisRole = false;
        this.apiTestService.testApiRole().subscribe(
            booleanData => {
                this.hasThisRole  = JSON.parse(JSON.parse(JSON.stringify(booleanData))._body);
            },
            error => console.log(error)
        );
    }

    //test:
    binding(){
        this.userService.bindingUserToSpring();
    }



}
