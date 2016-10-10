"use strict";
var http_1 = require('@angular/http');
var Config = (function () {
    function Config() {
        // back-end url to authenticate the user
        this.serverUrl = "http://localhost:3001/";
        // Api url, can sometimes same with serverUrl
        this.apiUrl = "http://localhost:3001/";
        // back-end url to authenticate the user
        this.loginUrl = "http://localhost:8011/user/login";
        this.auth0TokenName = "auth0Token";
        this.auth0ProfileName = "auth0UserData";
        // // retrieves currently auth0Token from HTML5 local storage
        // public auth0TokenJsonFromLocalStorage: string = appSettings.getString("auth0Token");
        // // retrieves currently logged in user from HTML5 local storage
        // public idTokenJsonLocalStorage: string = JSON.parse(appSettings.getString("auth0Token")).idToken;
        //
        // public profileJsonFromLocalStorage = appSettings.getString("auth0UserData");
        // public profileJsonFromLocalStorage = JSON.parse(appSettings.getString("auth0UserData"));
        // // retrieves currently logged in user from HTML5 local storage
        // public userNameFromLocalStorage: string = this.profileJsonFromLocalStorage.name;
        // retrieves generated token for logged in user from HTML5 local storage
        // public getTokenFromLocalStorage: string = appSettings.getItem("id_token");
        // sets the request headers as JSON type
        this.jsonHeader = new http_1.Headers({ 'Content-Type': 'application/json' });
        // back-end url to return all users
        this.sendTokenUrl = "http://localhost:8011/rest/user/users";
        // back-end rest API url to add new photos
        this.addPhotoUrl = "http://localhost:8011/rest/photo/add";
        // back-end rest API url to return all photos
        this.allPhotosUrl = "http://localhost:8011/photo/allPhotos";
        // back-end rest API url to add new comments
        this.addCommentUrl = "http://localhost:8011/rest/comment/add";
        // rest backend API url to find photos for a single logged in user
        this.photoByUserUrl = "http://localhost:8011/rest/photo/user";
        // backend rest API url to update a photo's details
        this.photoUpdateUrl = "http://localhost:8011/rest/photo/update";
        // Rest backend API url to get a photo by its ID
        this.photoByIdUrl = "http://localhost:8011/rest/photo/photoId";
        // backend url to register a user
        this.registerUrl = "http://localhost:8011/user/register";
        // backend rest API url to upload a single photo
        this.fileRequestUrl = "http://localhost:8011/rest/photo/upload";
        // backend rest API url to return a single user
        this.userNameUrl = "http://localhost:8011/rest/user/userName";
        // backend rest API to update a single user
        this.userUpdateUrl = "http://localhost:8011/rest/user/update";
    }
    Config.apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
    Config.token = "";
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFLeEM7SUFBQTtRQUtJLHdDQUF3QztRQUNqQyxjQUFTLEdBQVcsd0JBQXdCLENBQUM7UUFDcEQsNkNBQTZDO1FBQ3RDLFdBQU0sR0FBVyx3QkFBd0IsQ0FBQztRQUNqRCx3Q0FBd0M7UUFDakMsYUFBUSxHQUFXLGtDQUFrQyxDQUFDO1FBR3RELG1CQUFjLEdBQUcsWUFBWSxDQUFDO1FBQzlCLHFCQUFnQixHQUFHLGVBQWUsQ0FBQztRQU8xQyw2REFBNkQ7UUFDN0QsdUZBQXVGO1FBQ3ZGLGlFQUFpRTtRQUNqRSxvR0FBb0c7UUFDcEcsRUFBRTtRQUNGLCtFQUErRTtRQUMvRSwyRkFBMkY7UUFDM0YsaUVBQWlFO1FBQ2pFLG1GQUFtRjtRQUNuRix3RUFBd0U7UUFDeEUsNkVBQTZFO1FBRTdFLHdDQUF3QztRQUNqQyxlQUFVLEdBQVksSUFBSSxjQUFPLENBQUMsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLG1DQUFtQztRQUM1QixpQkFBWSxHQUFXLHVDQUF1QyxDQUFDO1FBQ3RFLDBDQUEwQztRQUNuQyxnQkFBVyxHQUFXLHNDQUFzQyxDQUFDO1FBQ3BFLDZDQUE2QztRQUN0QyxpQkFBWSxHQUFXLHVDQUF1QyxDQUFDO1FBQ3RFLDRDQUE0QztRQUNyQyxrQkFBYSxHQUFXLHdDQUF3QyxDQUFDO1FBQ3hFLGtFQUFrRTtRQUMzRCxtQkFBYyxHQUFXLHVDQUF1QyxDQUFDO1FBQ3hFLG1EQUFtRDtRQUM1QyxtQkFBYyxHQUFXLHlDQUF5QyxDQUFDO1FBQzFFLGdEQUFnRDtRQUN6QyxpQkFBWSxHQUFXLDBDQUEwQyxDQUFDO1FBQ3pFLGlDQUFpQztRQUMxQixnQkFBVyxHQUFXLHFDQUFxQyxDQUFDO1FBQ25FLGdEQUFnRDtRQUN6QyxtQkFBYyxHQUFXLHlDQUF5QyxDQUFDO1FBQzFFLCtDQUErQztRQUN4QyxnQkFBVyxHQUFXLDBDQUEwQyxDQUFDO1FBQ3hFLDJDQUEyQztRQUNwQyxrQkFBYSxHQUFXLHdDQUF3QyxDQUFDO0lBWTVFLENBQUM7SUFuRVUsYUFBTSxHQUFHLCtDQUErQyxDQUFDO0lBQ3pELFlBQUssR0FBRyxFQUFFLENBQUM7SUFrRXRCLGFBQUM7QUFBRCxDQUFDLEFBcEVELElBb0VDO0FBcEVZLGNBQU0sU0FvRWxCLENBQUEifQ==