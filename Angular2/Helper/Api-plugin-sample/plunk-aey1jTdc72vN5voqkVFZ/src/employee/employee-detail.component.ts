import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'my-employee-detail',
    template: `
      <h2>Employee Detail</h2>
      <a routerLink="/welcome">Back to menu</a>
    `
})
export class EmployeeDetailComponent {
  constructor(route: ActivatedRoute) {
    console.log(route);
  }
}