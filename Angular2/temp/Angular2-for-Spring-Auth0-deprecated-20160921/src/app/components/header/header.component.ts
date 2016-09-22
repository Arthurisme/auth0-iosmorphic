import {Component, OnInit} from '@angular/core';
import {Auth} from "../../auth.service";


@Component({
    // moduleId: module.id,
  selector: 'rb-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private auth: Auth) {}

  ngOnInit() {
  }

}
