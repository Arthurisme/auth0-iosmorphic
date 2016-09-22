import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import {UserService} from "./services/user.service";

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('WIcfe2CWGUmcmJwYEfCk763nXyGLOFM6', 'arthurisme.auth0.com', {
    auth: {
      // redirect: false,
      params: {
        scope: 'openid email roles user_metadata app_metadata picture offline_access',
      }
    }
  });


  //Store profile object in auth class
  userProfile: any;

  constructor( private userService:UserService) {
    // Set userProfile attribute if already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {

      console.log('authResult storged local by auth.service: \n', authResult)

      localStorage.setItem('id_token', authResult.idToken);
      console.log('id_token storged local by auth.service: \n', localStorage.getItem("id_token"))

      //binding user to spring boot:
      // this.userService.bindingUserToSpring().subscribe();





      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        console.log('profile from login: \n', this.userProfile);
        localStorage.setItem("currentUserName", (profile.email));
        console.log('currentUserName from profile from login: \n', localStorage.getItem("currentUserName"))

      });






    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
  };
};
