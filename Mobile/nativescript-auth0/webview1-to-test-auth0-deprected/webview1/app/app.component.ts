import {Component, NgZone} from "@angular/core";
// import {WebView} from "ui/web-view";
import webViewModule = require("ui/web-view");


@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {

    url = "https://github.com/";


    constructor(public _ngZone:NgZone) {

        this.url = "https://github.com/";

    }
}
