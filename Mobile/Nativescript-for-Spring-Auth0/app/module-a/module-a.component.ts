import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { connectionType, getConnectionType } from "connectivity";
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
import { prompt } from "ui/dialogs";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";

import { alert, setHintColor, LoginService, User } from "../shared";
import {NavigateService} from "../shared/service/navigate.service";

@Component({
  selector: "gr-login",
  templateUrl: "module-a/module-a.component.html",
  styleUrls: ["module-a/module-a-common.css", "module-a/module-a.component.css"],
})
export class ModuleAComponent  {






  constructor(private router: Router,
              private navigateService:NavigateService,
              private page: Page) {


  }

  ngOnInit() {
    // this.page.actionBarHidden = true;
  }








}
