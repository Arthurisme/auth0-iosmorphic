import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {PhotoService} from "../services/photo.service";
import {User} from '../models/User';
import {Photo} from '../models/Photo';
 import { Router }   from '@angular/router';

// import {ROUTER_DIRECTIVES} from '@angular/router';



@Component({
    // directives:[ROUTER_DIRECTIVES],
    selector: 'my-album',
    templateUrl: `my-album.component.html`
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

        console.log("current username storaged already was: \n");
        console.log(localStorage.getItem("currentUserName"));


        this.userService.getUserByName( localStorage.getItem("currentUserName")).subscribe(
        //     this.userService.getUserByName( "arthur.zhixin.liu@gmail.com").subscribe(

            user => {
                console.log("user from my-album:");
                console.log(user);

                this.user =  JSON.parse(JSON.parse(JSON.stringify(user))._body);
                // this.user =      (user) ._body ;
                // console.log("test user list : "+ (user) ._body);
                console.log(  this.user);


                // this.photoService.getPhotosByUser(this.user).subscribe(
                    this.photoService.getPhotosByUsername( localStorage.getItem("currentUserName")).subscribe(
                    photos => {
                        this.photos =  JSON.parse(JSON.parse(JSON.stringify(photos))._body) ;

                        console.log("test photos list in front end: " );
                        console.log(  this.photos);
                    }
                ),
                    error => console.log(error)
            }
        ),
            error => console.log(error)


    };

    onSelect(photo:Photo){
        this.selectedPhoto = photo;
        console.log("test photo : " );
        console.log(  this.selectedPhoto);
        //rc4:
        // this.router.navigate(['ImageDetail',{id:this.selectedPhoto.photoId}]);

        //rc6:
        let link = ['/image-detail', this.selectedPhoto.photoId];
        this.router.navigate(link);
    }

}
