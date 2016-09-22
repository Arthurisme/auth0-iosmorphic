import {Component, OnInit} from '@angular/core';

import { RecipeService } from "../recipes/recipe.service";

import {Auth} from "../auth.service";


@Component({
  selector: 'rb-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(
    // private recipeService: RecipeService,
    private auth: Auth
  ) {}


  ngOnInit() {
  }

  // onStore() {
  //   this.recipeService.storeData().subscribe(
  //     data => console.log(data),
  //     error => console.error(error)
  //   );
  // }
  //
  // onFetch() {
  //   this.recipeService.fetchData();
  // }

}
