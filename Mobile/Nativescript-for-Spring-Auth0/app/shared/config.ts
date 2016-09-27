import { Headers } from '@angular/http';
import * as appSettings from "application-settings";



export class Config {
    static apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
    static token = "";


    // back-end url to authenticate the user
    public serverUrl: string = "http://localhost:3001/";
    // Api url, can sometimes same with serverUrl
    public apiUrl: string = "http://localhost:3001/";
    // back-end url to authenticate the user
    public loginUrl: string = "http://localhost:8011/user/login";
    // retrieves currently logged in user from HTML5 local storage
    public userNameFromLocalStorage: string = appSettings.getString("currentUserName");

    // retrieves currently auth0Token from HTML5 local storage
    public auth0TokenFromLocalStorage: string = appSettings.getString("auth0Token");
    // retrieves currently logged in user from HTML5 local storage
    public idTokenJsonLocalStorage: string = JSON.parse(appSettings.getString("auth0Token")).idToken;



    // retrieves generated token for logged in user from HTML5 local storage
    // public getTokenFromLocalStorage: string = appSettings.getItem("id_token");

    // sets the request headers as JSON type
    public jsonHeader: Headers = new Headers({ 'Content-Type': 'application/json' });
    // back-end url to return all users
    public sendTokenUrl: string = "http://localhost:8011/rest/user/users";
    // back-end rest API url to add new photos
    public addPhotoUrl: string = "http://localhost:8011/rest/photo/add";
    // back-end rest API url to return all photos
    public allPhotosUrl: string = "http://localhost:8011/photo/allPhotos";
    // back-end rest API url to add new comments
    public addCommentUrl: string = "http://localhost:8011/rest/comment/add";
    // rest backend API url to find photos for a single logged in user
    public photoByUserUrl: string = "http://localhost:8011/rest/photo/user";
    // backend rest API url to update a photo's details
    public photoUpdateUrl: string = "http://localhost:8011/rest/photo/update";
    // Rest backend API url to get a photo by its ID
    public photoByIdUrl: string = "http://localhost:8011/rest/photo/photoId";
    // backend url to register a user
    public registerUrl: string = "http://localhost:8011/user/register";
    // backend rest API url to upload a single photo
    public fileRequestUrl: string = "http://localhost:8011/rest/photo/upload";
    // backend rest API url to return a single user
    public userNameUrl: string = "http://localhost:8011/rest/user/userName";
    // backend rest API to update a single user
    public userUpdateUrl: string = "http://localhost:8011/rest/user/update";

    // sets authentication headers
    public authHeaderGet: Headers = new Headers({ 'Authorization': 'Bearer ' + JSON.parse(appSettings.getString("auth0Token")).idToken });
    // sets authentication headers
    public authHeader: Headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(appSettings.getString("auth0Token")).idToken });
}
