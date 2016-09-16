 import {User} from '../../../models/user';
import {Photo} from '../../../models/photo';
import {UserService} from "../../../services/user.service";
import {PhotoService} from "../../../services/photo.service";
// import {Router} from '@angular/router-deprecated';
// import {RouteP} from '@angular/router';
// import {ROUTER_DIRECTIVES} from '@angular/router';
 import { Router }   from '@angular/router';


 // import {ImageComments} from "image-comments.component";
import { ActivatedRoute, Params } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';





@Component({
    selector: 'image-detail',
    templateUrl: './image-detail.component.html',
    styleUrls: [ '../../../resources/css/semantic.css', '../../../resources/css/modules/photo.css' ],

    // directives:[ImageComments]
})
export class ImageDetail implements OnInit{
    // @Input() hero: Hero;
    // @Output() close = new EventEmitter();
    error: any;
    navigated = false; // true if navigated here

      photo:Photo = new Photo;
      // photos: Photo[];
      user:User= new User;
      // selectedPhoto:Photo;
      like:string;

    constructor(
        private photoService:PhotoService,
        private userService:UserService,
        private route: ActivatedRoute

    ){
        // let photoId = Number.parseInt(this.routeParams.get('id'));
        //
        //
        //         this.photoService.getPhotoById(photoId).subscribe(
        //             photo => {
        //                 this.photo =  JSON.parse(JSON.parse(JSON.stringify(photo))._body);
        //
        //
        //                 this.userService.getUserByName(localStorage.getItem("currentUserName")).subscribe(
        //
        //                     user => {
        //                         this.user =  JSON.parse(JSON.parse(JSON.stringify(user))._body);
        //
        //                         if(this.user.likedPhotoList.filter(photo => photo.photoId == this.photo.photoId)[0]){
        //                             this.like = "Unlike"
        //                         }else{
        //                             this.like = "Like"
        //                         }
        //
        //
        //
        //                     },
        //                     error => console.log(error)
        //                 )
        //
        //             },
        //             error => console.log(error)
        //         )
    }


    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.navigated = true;
                // this.heroService.getHero(id)
                //     .then(hero => this.hero = hero);


                let photoId = id;
                // let photoId = Number.parseInt(this.routeParams.get('id'));


                this.photoService.getPhotoById(photoId).subscribe(
                    photo => {
                        this.photo =  JSON.parse(JSON.parse(JSON.stringify(photo))._body);


                        this.userService.getUserByName(localStorage.getItem("currentUserName")).subscribe(

                            user => {
                                this.user =  JSON.parse(JSON.parse(JSON.stringify(user))._body);

                                console.log("user  was: \n");
                                console.log( this.user);

                                if(this.user.likedPhotoList == null) {
                                    this.user.likedPhotoList = [];
                                }

                                // if(this.user.likedPhotoList != null){
                                    if(this.user.likedPhotoList.filter(photo => photo.photoId == this.photo.photoId)[0]){
                                        this.like = "Unlike"
                                    }else{
                                        this.like = "Like"
                                    }
                                // }





                            },
                            error => console.log(error)
                        )

                    },
                    error => console.log(error)
                )



            } else {
                this.navigated = false;
                // this.hero = new Hero();
            }
        });
    }


   goBack(){
     window.history.back();
    }


    likeDisplay(){
        if(this.like == "Like"){
            this.like = "Unlike";
            console.log("user click wherewas 1 like was: \n");
            console.log( this.user);
            console.log("photo click wherewas 1 like was: \n");
            console.log( this.photo);
            if(this.user.likedPhotoList == null) {
                this.user.likedPhotoList = [];
            }
            this.user.likedPhotoList.push(this.photo);
            console.log("user click wherewas 2 like was: \n");
            console.log( this.user);
            this.photo.likes+=1;
            console.log("user click wherewas like was: \n");
            console.log( this.user);
            this.userService.updateUser(this.user).subscribe();
            this.photoService.updatePhoto(this.photo).subscribe();
        }else{
            this.like="Like";
            if(this.user.likedPhotoList == null) {
                this.user.likedPhotoList = [];
            }

            // if(this.user.likedPhotoList != null) {

                for (let i = 0; i < this.user.likedPhotoList.length; i++) {
                    if (this.user.likedPhotoList[i].photoId == this.photo.photoId) {
                        this.user.likedPhotoList.slice(i, 1);
                    }
                }
            // }

            this.photo.likes-=1;
            console.log("user click wherewas unlike was: \n");
            console.log( this.user);
            this.userService.updateUser(this.user).subscribe();
            this.photoService.updatePhoto(this.photo).subscribe();
        }
    }

}
