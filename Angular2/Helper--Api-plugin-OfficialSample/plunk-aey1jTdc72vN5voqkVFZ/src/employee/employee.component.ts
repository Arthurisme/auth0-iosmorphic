import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'my-employee',
    template: `
      <div>
      <h1>Employee #{{employeeId}}</h1>
      <router-outlet></router-outlet>
      <router-outlet name="aux"></router-outlet>
      `
})
export class EmployeeComponent {
  employeeId: number;
  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => this.employeeId = params['id']);
  }
}