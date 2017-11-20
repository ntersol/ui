import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div class="container mt-3">
      <h1>404: page missing</h1>
        <p><a href="/#/">Click here to go to your dashboard</a></p>
    </div>
  `
})
export class NoContentComponent {

}
