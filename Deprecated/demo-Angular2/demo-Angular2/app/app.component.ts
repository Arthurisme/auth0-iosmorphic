import {Component, NgZone, OnInit} from "@angular/core";
var auth0 = require("nativescript-auth0");
var application = require("application");
import * as appSettings from "application-settings";
declare var android: any;
declare var UIResponder: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;
declare var UIApplicationDelegate: any;
declare var  appDelegate : any;
declare var   __extends: any;

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent   implements OnInit{
    public counter: number = 16;
    __extends: any;


    constructor() {



    }

    login() {
        console.log("TTTTT");

        auth0.show().then(function(args){
            console.log(args.profile);
            console.log(args.token);
            appSettings.setString("UserData", JSON.stringify(args));
        });
    }




    ngOnInit() {
    }



    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }
    
    public onTap() {
        this.counter--;
    }
}
