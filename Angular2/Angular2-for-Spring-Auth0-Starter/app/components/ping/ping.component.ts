import { Component } from '@angular/core';
import { Auth }      from '../../auth.service';
import { AuthHttp }  from 'angular2-jwt';
import { Http,Headers }      from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'ping',
  templateUrl: 'app/components/ping/ping.template.html'
})

export class PingComponent {
  API_URL: string = 'http://localhost:3001';
  message: string;

  constructor(private auth: Auth, private http: Http, private authHttp: AuthHttp) {}

  public ping() {
    this.message = '';
    console.log("start ping");
    let tokenAtLocal = localStorage.getItem('id_token');
      console.log("tokenAtLocal storaged already was: \n");
      console.log(tokenAtLocal);

      this.http.get(`${this.API_URL}/ping`)
      // .map(res => res.json())
      .subscribe(
        data => {

            console.log( "data origin:");
            console.log( data);
            // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            this.message =  (JSON.parse(JSON.stringify(data))._body);
          // this.message =  data._body ;
        },

        error => this.message = error._body
      );
  }
  public securedPing() {
      this.message = '';
      console.log("start ping");
      let tokenAtLocal = localStorage.getItem('id_token');
      console.log("tokenAtLocal storaged already was: \n");
      console.log(tokenAtLocal);

    let headers = new Headers({'Authorization': 'Bearer '+tokenAtLocal});

    this.http.get(`${this.API_URL}/secured/ping`, {headers: headers})
    // .map(res => res.json())
        .subscribe(
            data => {
              console.log(data);
              // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
              this.message =  (JSON.parse(JSON.stringify(data))._body);
              // this.message =  data._body ;

            },
            error => this.message = error._body || error
        );
  }


  public securedPingorigin() {
    this.message = '';
    this.authHttp.get(`${this.API_URL}/secured/ping`)
      // .map(res => res.json())
      .subscribe(
          data => {
            console.log(data);
              // this.message = JSON.parse(JSON.parse(JSON.stringify(data))._body);
              this.message =  (JSON.parse(JSON.stringify(data))._body);
              // this.message =  data._body ;

          },
        error => this.message = error._body || error
      );
  }




};
