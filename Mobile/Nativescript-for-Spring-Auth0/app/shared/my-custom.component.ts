import { Component } from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'arthur-my-custom',
  templateUrl: 'my-custom.component.html'
})
export class MyCustomComponent {

  constructor(         private router:Router
  ) {}


  goToTest(){

    console.log("tttt");


    //rc6:
    let link = ['/profile'];
    this.router.navigate(link);

    // //Test for router rc7 function:
    // this.router.navigate(['image-detail/1']);

  }

}
