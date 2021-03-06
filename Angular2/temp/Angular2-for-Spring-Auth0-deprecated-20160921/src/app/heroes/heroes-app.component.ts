import { Component } from '@angular/core';

@Component({
    // moduleId: module.id,
  selector: 'my-heroes-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['heroes-app.component.css']
})
export class HeroesAppComponent {
  title = 'Tour of Heroes';
}
