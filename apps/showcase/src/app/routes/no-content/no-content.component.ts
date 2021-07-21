import { Component } from '@angular/core';

@Component({
  selector: 'nts-show-no-content',
  template: `
    <div class="container mt-3">
      <h1>404: page missing</h1>
      <p><a href="/#/">Click here to go to the homepage.</a></p>
    </div>
  `,
})
export class NoContentComponent { }
