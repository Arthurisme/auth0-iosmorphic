import {Component, ElementRef, NgZone, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/pagetwo/pagetwo.html",
  styleUrls: ["pages/pagetwo/pagetwo-common.css", "pages/pagetwo/pagetwo.css"],
  providers: [GroceryListService]
})
export class PagetwoPage implements OnInit {




  constructor(
      private _router: Router,
    private _groceryListService: GroceryListService,
    private _zone: NgZone) {}

  ngOnInit() {
  }








}