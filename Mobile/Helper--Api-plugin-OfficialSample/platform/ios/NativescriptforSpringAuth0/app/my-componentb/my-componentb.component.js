"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// import {Http, ConnectionBackend}      from '@angular/http';
var http_1 = require('@angular/http');
require("rxjs/add/operator/map");
var auth0 = require("nativescript-auth0");
var application = require("application");
// import {HeaderComponent} from "../header/header.component";
var MyComponentbComponent = (function () {
    function MyComponentbComponent(router, http) {
        this.router = router;
        this.http = http;
        this.API_URL = 'http://localhost:3001';
        this.messagePing = 'begin text';
        this.messageSecurityPing = 'begin text';
    }
    MyComponentbComponent.prototype.ngOnInit = function () {
    };
    // public ping() {
    //     this.messagePing = '';
    //     console.log("start ping");
    //     // let tokenAtLocal = appSettings.getString('auth0Token');
    //     // var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //     // console.log("tokenAtLocal");
    //     // console.log(tokenAtLocal);
    //
    //     //test this.http @angular
    //     this.http.get(`${this.API_URL}/ping`)
    //     .map(res => res.json())
    //         .subscribe(
    //             data => {
    //
    //                 console.log( "data origin:");
    //                 console.log( data);
    //                 console.log( "data._body origin:");
    //                 console.log(data.toString());
    //
    //                 this.messagePing = data.toString();
    //                 this.messageLast=this.messagePing;
    //                 // this.messages =  ((JSON.parse(data)));
    //
    //                 // this.messages = JSON.parse(JSON.parse(JSON.stringify(data)));
    //                 // this.messages = JSON.parse(JSON.parse(JSON.stringify(data))._body);
    //                 // this.messages =  (JSON.parse(JSON.stringify(data))._body);
    //                 console.log( "messageORs from http.get() :");
    //                 console.log( this.messageLast);
    //                 // this.message =  data._body ;
    //             },
    //
    //             error => this.messagePing = error._body
    //         );
    //     //End test this.http @angular
    //
    //
    //     // http.request({
    //     //     url: `${this.API_URL}/ping`,
    //     //     method: "GET"
    //     // }).then( (response) => {
    //     //
    //     //     let str = response.content.toString();
    //     //     console.log("result str:");
    //     //     console.log(str);
    //     //
    //     //
    //     //     this.message = str;
    //     //     this.messageORs=this.message;
    //     //     // this.message = "test message after ping.";
    //     //
    //     //
    //     // }, function (err) {
    //     //     console.log(err);
    //     // });
    //
    // }
    // public securedPing() {
    //     this.messages = '';
    //     console.log("start ping");
    //     let tokenAtLocal = appSettings.getString('auth0Token');
    //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //     console.log("tokenAtLocal");
    //     console.log(tokenAtLocal);
    //     console.log("tokenData");
    //     console.log(tokenData);
    //
    //     let idTokenJson =  tokenData.idToken;
    //     console.log("idTokenJson");
    //     console.log(idTokenJson);
    //
    //
    //
    //     let header =   {'Authorization': 'Bearer '+idTokenJson} ;
    //     //or in some http:  headers: { "Content-Type": "application/json" },
    //
    //
    //
    //     http.request({
    //         url: `${this.API_URL}/secured/ping`,
    //         method: "GET",
    //         headers: header
    //
    //     }).then( (response) => {
    //
    //         let str = response.content.toString();
    //         console.log("result str:");
    //         console.log(str);
    //
    //
    //         this.messages = str;
    //         this.messageORs=this.messages;
    //
    //         // this.message = "test message after ping.";
    //
    //
    //     }, function (err) {
    //         console.log(err);
    //     });
    //
    // }
    // public ping() {
    //     this.message = '';
    //     console.log("start ping");
    //     let tokenAtLocal = appSettings.getString('auth0Token');
    //     var tokenData = JSON.parse(appSettings.getString("auth0Token"));
    //
    //     console.log(tokenAtLocal);
    //
    //
    //     http.request({
    //         url: `${this.API_URL}/ping`,
    //         method: "GET"
    //     }).then(function (response) {
    //
    //         var str = response.content.toString();
    //         console.log("result str:");
    //         console.log(str);
    //
    //
    //         // this.message = str;
    //         this.message = "ttttt";
    //
    //
    //     }, function (err) {
    //         console.log(err);
    //     });
    //
    //
    // }
    MyComponentbComponent.prototype.goToGroceries = function () {
        this.router.navigate(["/groceries"]);
    };
    MyComponentbComponent = __decorate([
        core_1.Component({
            selector: "actionbar-headerb",
            templateUrl: "my-componentb/my-componentb.component.html",
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], MyComponentbComponent);
    return MyComponentbComponent;
}());
exports.MyComponentbComponent = MyComponentbComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktY29tcG9uZW50Yi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJteS1jb21wb25lbnRiLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXVELGVBQWUsQ0FBQyxDQUFBO0FBQ3ZFLHVCQUFxQixpQkFBaUIsQ0FBQyxDQUFBO0FBQ3ZDLDhEQUE4RDtBQUM5RCxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFFcEQsUUFBTyx1QkFBdUIsQ0FBQyxDQUFBO0FBTy9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUl6Qyw4REFBOEQ7QUFROUQ7SUFPSSwrQkFBb0IsTUFBYSxFQUNWLElBQVU7UUFEYixXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQ1YsU0FBSSxHQUFKLElBQUksQ0FBTTtRQU5qQyxZQUFPLEdBQVUsdUJBQXVCLENBQUM7UUFDekMsZ0JBQVcsR0FBVSxZQUFZLENBQUM7UUFDbEMsd0JBQW1CLEdBQVUsWUFBWSxDQUFDO0lBUTFDLENBQUM7SUFFRCx3Q0FBUSxHQUFSO0lBQ0EsQ0FBQztJQUdELGtCQUFrQjtJQUNsQiw2QkFBNkI7SUFDN0IsaUNBQWlDO0lBQ2pDLGlFQUFpRTtJQUNqRSwwRUFBMEU7SUFDMUUsc0NBQXNDO0lBQ3RDLG9DQUFvQztJQUNwQyxFQUFFO0lBQ0YsZ0NBQWdDO0lBQ2hDLDRDQUE0QztJQUM1Qyw4QkFBOEI7SUFDOUIsc0JBQXNCO0lBQ3RCLHdCQUF3QjtJQUN4QixFQUFFO0lBQ0YsZ0RBQWdEO0lBQ2hELHNDQUFzQztJQUN0QyxzREFBc0Q7SUFDdEQsZ0RBQWdEO0lBQ2hELEVBQUU7SUFDRixzREFBc0Q7SUFDdEQscURBQXFEO0lBQ3JELDREQUE0RDtJQUM1RCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLHlGQUF5RjtJQUN6RixnRkFBZ0Y7SUFDaEYsZ0VBQWdFO0lBQ2hFLGtEQUFrRDtJQUNsRCxrREFBa0Q7SUFDbEQsaUJBQWlCO0lBQ2pCLEVBQUU7SUFDRixzREFBc0Q7SUFDdEQsYUFBYTtJQUNiLG9DQUFvQztJQUNwQyxFQUFFO0lBQ0YsRUFBRTtJQUNGLHdCQUF3QjtJQUN4QiwwQ0FBMEM7SUFDMUMsMkJBQTJCO0lBQzNCLGtDQUFrQztJQUNsQyxTQUFTO0lBQ1Qsb0RBQW9EO0lBQ3BELHlDQUF5QztJQUN6QywrQkFBK0I7SUFDL0IsU0FBUztJQUNULFNBQVM7SUFDVCxpQ0FBaUM7SUFDakMsMkNBQTJDO0lBQzNDLDJEQUEyRDtJQUMzRCxTQUFTO0lBQ1QsU0FBUztJQUNULDZCQUE2QjtJQUM3QiwrQkFBK0I7SUFDL0IsYUFBYTtJQUNiLEVBQUU7SUFDRixJQUFJO0lBTUoseUJBQXlCO0lBQ3pCLDBCQUEwQjtJQUMxQixpQ0FBaUM7SUFDakMsOERBQThEO0lBQzlELHVFQUF1RTtJQUN2RSxtQ0FBbUM7SUFDbkMsaUNBQWlDO0lBQ2pDLGdDQUFnQztJQUNoQyw4QkFBOEI7SUFDOUIsRUFBRTtJQUNGLDRDQUE0QztJQUM1QyxrQ0FBa0M7SUFDbEMsZ0NBQWdDO0lBQ2hDLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLGdFQUFnRTtJQUNoRSwyRUFBMkU7SUFDM0UsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YscUJBQXFCO0lBQ3JCLCtDQUErQztJQUMvQyx5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLEVBQUU7SUFDRiwrQkFBK0I7SUFDL0IsRUFBRTtJQUNGLGlEQUFpRDtJQUNqRCxzQ0FBc0M7SUFDdEMsNEJBQTRCO0lBQzVCLEVBQUU7SUFDRixFQUFFO0lBQ0YsK0JBQStCO0lBQy9CLHlDQUF5QztJQUN6QyxFQUFFO0lBQ0Ysd0RBQXdEO0lBQ3hELEVBQUU7SUFDRixFQUFFO0lBQ0YsMEJBQTBCO0lBQzFCLDRCQUE0QjtJQUM1QixVQUFVO0lBQ1YsRUFBRTtJQUNGLElBQUk7SUFNSixrQkFBa0I7SUFDbEIseUJBQXlCO0lBQ3pCLGlDQUFpQztJQUNqQyw4REFBOEQ7SUFDOUQsdUVBQXVFO0lBQ3ZFLEVBQUU7SUFDRixpQ0FBaUM7SUFDakMsRUFBRTtJQUNGLEVBQUU7SUFDRixxQkFBcUI7SUFDckIsdUNBQXVDO0lBQ3ZDLHdCQUF3QjtJQUN4QixvQ0FBb0M7SUFDcEMsRUFBRTtJQUNGLGlEQUFpRDtJQUNqRCxzQ0FBc0M7SUFDdEMsNEJBQTRCO0lBQzVCLEVBQUU7SUFDRixFQUFFO0lBQ0YsaUNBQWlDO0lBQ2pDLGtDQUFrQztJQUNsQyxFQUFFO0lBQ0YsRUFBRTtJQUNGLDBCQUEwQjtJQUMxQiw0QkFBNEI7SUFDNUIsVUFBVTtJQUNWLEVBQUU7SUFDRixFQUFFO0lBQ0YsSUFBSTtJQUdKLDZDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFFekMsQ0FBQztJQXZLTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFdBQVcsRUFBRSw0Q0FBNEM7U0FFNUQsQ0FBQzs7NkJBQUE7SUFzS0YsNEJBQUM7QUFBRCxDQUFDLEFBcktELElBcUtDO0FBcktZLDZCQUFxQix3QkFxS2pDLENBQUEifQ==