import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Router} from "@angular/router";
import { action } from "ui/dialogs";


import  {Observable} from 'rxjs/Observable';


@Injectable()
export class NavigateService {
    constructor (
        private router:Router,
        private http:Http
    ) {}

    // sendCredentials (model) {
    //     let tokenUrl = "http://localhost:8080/user/login";
    //     let headers1 = new Headers({'Content-Type': 'application/json'});
    //
    //     return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers1});
    // }

    // check if downloaded token same with server:
    testApiRole () {
        let userUrl = "http://localhost:3001/api/role/user";
        // let headers2 = new Headers({'Authorization': 'Bearer '+token});


        // let headers2 = new Headers({'Authorization': 'Bearer '+token});
        // let header2 = new Headers({'Content-Type': 'application/json', 'Authorization':'Bearer '+localStorage.getItem("token")});
        let header2 = new Headers({  'Authorization':'Bearer '+localStorage.getItem("id_token")});


        return this.http.get(userUrl,  {headers: header2});

        // return this.http.get(userUrl);
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
        localStorage.setItem("token","");
        localStorage.setItem("currentUserName","");
        alert("You just logged out.")
    }

    goToPing() {
        this.router.navigate(["/ping"]);
    }
    goToModuleA() {
        this.router.navigate(["/modulea"]);
    }
    goToGroceries(){
        this.router.navigate(["/groceries"]);

    }

    showMenu() {
        action({
            message: "What would you like to do?",
            actions: ["Go to Ping", "Go to Module A", "Go to Groceries"],
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result === "Go to Ping") {
                this.goToPing();
            } else if (result === "Go to Module A") {
                this.goToModuleA();
            }else if (result === "Go to Groceries") {
                this.goToGroceries();
            }
        });
    }



}