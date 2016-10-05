import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { Page } from "ui/page";


@Component({
  selector: "my-component",
  templateUrl: "components/mycomponent/mycomponent.html"
 })
export class MyComponentComponent   {

  constructor(private router: Router, private page: Page) {

  }

}
