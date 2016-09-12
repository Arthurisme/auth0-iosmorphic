import {Injectable} from '@angular/core';
import {Photo} from '../models/photo';
import {User} from '../models/user';
import {Http, Headers} from '@angular/http';

@Injectable()
export  class PhotoService{

    constructor (private http:Http){}

    getPhotosByUser(user: User) {
        let url="http://localhost:3001/rest/photo/user";
        let header = new Headers ({'Content-Type' : 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, JSON.stringify(user), {headers: header});
    }

    getPhotoById(photoId: number) {
        let url="http://localhost:3001/rest/photo/photoId";
        let header = new Headers ({'Content-Type' : 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, JSON.stringify(photoId), {headers: header});
    }

    updatePhoto(photo: Photo) {
        let url="http://localhost:3001/rest/photo/update";
        let header = new Headers ({'Content-Type' : 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, JSON.stringify(photo), {headers: header});
    }

    getPhotos() {
        let url="http://localhost:3001/photo/allPhotos";
        return this.http.get(url);
    }

}