import {Injectable} from '@angular/core';
import {Photo} from '../models/photo';
import {User} from '../models/user';
import {Http, Headers} from '@angular/http';

@Injectable()
export  class UserService{
    API_URL: string = 'http://localhost:3001';
    message: string;

    constructor (private http:Http){}

    getUserByName(username: string){


        console.log(" id_token already was (user.service.ts): \n");
        console.log(localStorage.getItem("id_token"));

        let url = "http://localhost:3001/rest/user/username";
        let header = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, username, {headers:header} );
    }

    updateUser(user: User) {
        let url="http://localhost:3001/rest/user/update";
        let header=new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("id_token")});

        return this.http.post(url, JSON.stringify(user), {headers: header});
    }

    bindingUserToSpring() {
        console.log("binding clicked  past to on user.service. ");

        let userUrl = "http://localhost:3001/api/v1/user/binding";
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});


        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let header2 = new Headers({'Content-Type': 'application/json', 'Authorization':'Bearer '+localStorage.getItem("token")});
        let header = new Headers({  'Authorization':'Bearer '+localStorage.getItem("id_token")});

        console.log("binding clicked  past (just before return) to on user.service. ");


         return this.http.get(`${this.API_URL}/api/v1/user/binding`,  {headers: header}) ;

        // return this.http.get(userUrl);
    }


    public bindingUserToSpringTest1() {
        this.message = '';
        console.log("start ping");
        let tokenAtLocal = localStorage.getItem('id_token');
        console.log("tokenAtLocal storaged already was: \n");
        console.log(tokenAtLocal);

        let headers = new Headers({'Authorization': 'Bearer '+tokenAtLocal});


        this.http.get(`${this.API_URL}/ping`,{headers: headers})
        // .map(res => res.json())
            .subscribe(
                data => {

                    console.log( "data origin:");
                    console.log( data);
                    // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                    this.message =  (JSON.parse(JSON.stringify(data))._body);
                    console.log(this.message);
                    // this.message =  data._body ;
                },

                error => this.message = error._body
            );
    }

    public bindingUserToSpringTest2() {
        this.message = '';
        console.log("start ping");
        let tokenAtLocal = localStorage.getItem('id_token');
        console.log("tokenAtLocal storaged already was: \n");
        console.log(tokenAtLocal);

        let headers = new Headers({'Authorization': 'Bearer '+tokenAtLocal});


        this.http.get(`${this.API_URL}/api/v1/user/binding`,{headers: headers})
        // .map(res => res.json())
            .subscribe(
                data => {

                    console.log( "data origin:");
                    console.log( data);
                    // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                    this.message =  (JSON.parse(JSON.stringify(data))._body);
                    console.log(this.message);
                    // this.message =  data._body ;
                },

                error => this.message = error._body
            );
    }


}