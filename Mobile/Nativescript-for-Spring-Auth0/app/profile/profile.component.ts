import { Component }         from '@angular/core';
import { Routes } from '@angular/router';
import {NavigateService} from "../shared/service/navigate.service";


@Component({
  selector: "profile",
  templateUrl: "profile/profile.component.html"
  // template: "<router-outlet></router-outlet>"

})

export class ProfileComponent {


  constructor(
      private navigateService:NavigateService
  ) {}


}
