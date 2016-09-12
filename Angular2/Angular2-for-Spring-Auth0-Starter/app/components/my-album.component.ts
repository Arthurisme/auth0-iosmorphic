import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {PhotoService} from "../services/photo.service";
import {User} from '../models/User';
import {Photo} from '../models/Photo';
 import { Router }   from '@angular/router';

import {ROUTER_DIRECTIVES} from '@angular/router';



@Component({
    directives:[ROUTER_DIRECTIVES],
    selector: 'my-album',
    templateUrl: `app/components/my-album.component.html`
})
export class MyAlbum {
    private photos: Photo[];
    private user;
    private selectedPhoto:Photo;

    constructor(
        private photoService:PhotoService,
        private router:Router,
        private userService:UserService

    ){

        // currentUserNameAtLocal=localStorage.setItem("currentUserName","arthur.zhixin.liu@gmail.com");
        console.log("tokenAtLocal storaged already was: \n");
        // console.log(currentUserNameAtLocal);


        this.userService.getUserByName('arthur.zhixin.liu@gmail.com').subscribe(

            // user => {
            //     this.user =  JSON.parse(JSON.parse(JSON.stringify(user))._body);
            //
            //     this.photoService.getPhotosByUser(this.user).subscribe(
            //         photos => {
            //             this.photos =  JSON.parse(JSON.parse(JSON.stringify(photos))._body) ;
            //
            //             console.log("test photos list in front end: "+ this.photos);
            //         }
            //     ),
            //         error => console.log(error)
            // }
        ),
            error => console.log(error)


    };

    onSelect(photo:Photo){
        this.selectedPhoto = photo;
        this.router.navigate(['ImageDetail',{id:this.selectedPhoto.photoId}]);

    }

}
