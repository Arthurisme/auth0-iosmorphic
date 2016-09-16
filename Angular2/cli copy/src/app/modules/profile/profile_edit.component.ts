import { Component }            from '@angular/core';
import { Http } from '@angular/http';
import { Auth }                 from '../../auth.service';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';
import { Router }               from '@angular/router';
import 'rxjs/add/operator/map';
// import { FORM_DIRECTIVES } from '@angular/common'

@Component({
  selector: 'profile',
  templateUrl: 'profile_edit.template.html',
  // providers: [
  //   AuthHttp,
  //   provideAuth({
  //     headerName: 'Authorization',
  //     headerPrefix: 'bearer',
  //     tokenName: 'token',
  //     tokenGetter: (() => localStorage.getItem('id_token')),
  //     globalHeaders: [{ 'Content-Type': 'application/json' }],
  //     noJwtError: true
  //   })
  // ],
  // directives:[FORM_DIRECTIVES]
})

export class ProfileEdit {
  address: String
  constructor(private auth: Auth,
              private authHttp: AuthHttp,
              private router: Router
  ) {
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.address){
      this.address = auth.userProfile.user_metadata.address;
    }
  }

  onSubmit() {
    var headers: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data: any = JSON.stringify({
      user_metadata: {
        address: this.address
      }
    });

    this.authHttp
      .patch('https://' + 'YOUR_DOMAIN' + '/api/v2/users/' + this.auth.userProfile.user_id, data, {headers: headers})
      .map(response => response.json())
      .subscribe(
        response => {
          this.auth.userProfile = response;
          localStorage.setItem('profile', JSON.stringify(response));
          this.router.navigate(['/profile']);
        },
        error => alert(error.json().message)
      );
  }
}
