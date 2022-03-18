import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styles: [
    `
      ul {
        margin-left: 0;
        padding-left: 0;
        list-style: none;
      }
    `,
  ],
})
export class LayoutMainComponent {
  constructor() {}
}
