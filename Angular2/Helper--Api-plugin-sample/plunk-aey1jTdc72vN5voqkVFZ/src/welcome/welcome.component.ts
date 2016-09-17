import { Component } from '@angular/core';

@Component({
    selector: 'my-welcome',
    template: `
      <ul>
        <li><a [routerLink]="[{ outlets: { 'aux': ['/employee/14/chat'] } }]">Employee 14 with chat window</a></li>
        <li><a [routerLink]="['/employee/14']">Employee 14 without chat window</a></li>
        <!--a routerLink="/employee/14/sales">Employee 14/Sales</a-->
      </ul>
    `
})
export class WelcomeComponent {}