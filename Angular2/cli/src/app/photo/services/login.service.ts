import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import  {Observable} from 'rxjs/Observable';


@Injectable()
export class LoginService {
    constructor (private http:Http) {}

    sendCredentials (model) {
        let tokenUrl = "http://localhost:3001/user/login";
        let headers1 = new Headers({'Content-Type': 'application/json'});

        return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers1});
    }

    // check if downloaded token same with server:
    sendToken (id_token) {
        let userUrl = "http://localhost:3001/rest/user/users";
        let headers2 = new Headers({'Authorization': 'Bearer '+id_token});

        return this.http.get(userUrl,  {headers: headers2});
    }

    checkLogin()
    {
        if(localStorage.getItem("currentUserName")!="" && localStorage.getItem("id_token")!=""){
            return true;
        }else {
            return false;
        }
    }

    logout()
    {
        localStorage.setItem("id_token","");
        localStorage.setItem("currentUserName","");
        alert("You just logged out.")
    }

}