import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {PhotoService} from "../../services/photo.service";
import {User} from '../../models/user';
import {Photo} from '../../models/photo';
import {Router} from '@angular/router';
// import {ROUTER_DIRECTIVES} from '@angular/router';
import {Observable} from 'rxjs/Observable'


@Component({
    selector: 'photo-row',
    templateUrl: './photo-row.component.html',
    // styleUrls: [ '../../../resources/css/semantic.css', '../../../resources/css/modules/photo.css' ],

})
export class PhotoRow {
    photoList:Photo[];
    photoListSorted:Photo[];
    photoListRanked:Photo[];
    selectedPhoto:Photo;


    constructor(
        private photoService:PhotoService,
        private router:Router
    ) {
        this.photoService.getPhotos().subscribe(
            photos => {
                this.photoList = JSON.parse(JSON.parse(JSON.stringify(photos))._body);
                this.photoListSorted = this.photoList.sort((a,b) => b.likes - a.likes);

                this.photoListRanked = [];

                for(let index in this.photoListSorted){
                    if(Number(index)<3){
                     this.photoListRanked.push(this.photoListSorted[index]);
                    }
                    else{
                        break;
                    }
                }
            },
            error => console.log(error)
        );


    }

    onSelect(photo:Photo) {
        this.selectedPhoto = photo;
        // this.router.navigate(['ImageDetail', {id: this.selectedPhoto.photoId}]);

        let link = ['/image-detail', this.selectedPhoto.photoId];
        this.router.navigate(link);
    }

}
