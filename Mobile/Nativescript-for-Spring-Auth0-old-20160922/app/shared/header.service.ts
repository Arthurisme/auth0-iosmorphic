import { Injectable } from "@angular/core";

import { Router } from "@angular/router";


@Injectable()
export class HeaderService {




    constructor(private router: Router
                // private backend: BackendService
    ) {
        // if (this.token) {
        //   this.backend.el.authentication.setAuthorization(this.token, "bearer");
        // }
    }

    // register(user: User) {
    //   return this.backend.el.Users.register(user.email, user.password)
    //     .catch(this.handleErrors);
    // }



    goToGroceries(){
        this.router.navigate(["/groceries"]);

    }

    handleErrors(error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    }
}