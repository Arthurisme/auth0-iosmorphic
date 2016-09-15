import {Injectable} from '@angular/core';
import {Photo} from '../models/photo';
import {User} from '../models/user';
import {Comment} from '../models/comment';

import {Http, Headers} from '@angular/http';




@Injectable()
export  class CommentService{

    constructor(private http:Http){}

    addComment(comment:Comment){

        console.log(" comment add by comment.service is: \n");
        console.log(comment);

        let url = "http://localhost:3001/rest/comment/add";
        let header = new Headers({'Content-Type': 'application/json', 'Authorization':'Bearer '+localStorage.getItem("id_token")});

       return this.http.post(url,JSON.stringify(comment),{headers:header});
 }


    getCommentsByPhotoId(photoId: Number) {
        console.log(" photoId add by comment.service is: \n");
        console.log(photoId);
        let url="http://localhost:3001/rest/comment/photoId";
        let header = new Headers ({'Content-Type' : 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, photoId, {headers: header});
    }


}