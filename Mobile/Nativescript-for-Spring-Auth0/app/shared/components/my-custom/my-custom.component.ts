import { Component } from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'arthur-my-custom',
  templateUrl: 'shared/components/my-custom/my-custom.component.html',
  styleUrls: ["shared/components/my-custom/my-custom-common.css", "shared/components/my-custom/my-custom.component.css"],

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



  goToGroceries(){
    this.router.navigate(["/groceries"]);

  }

  goToPing() {
    this.router.navigate(["/ping"]);
  }

  goToModuleA() {
    this.router.navigate(["/modulea"]);
  }

}
