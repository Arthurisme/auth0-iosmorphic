import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {Header2Component} from "./header2.component";

@NgModule({
  declarations: [
    Header2Component
  ],
  imports:      [
    CommonModule ,
   ],
    exports: [
      CommonModule,
      Header2Component
    ]
})
export class SharedModule {}
