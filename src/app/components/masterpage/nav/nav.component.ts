import { Component } from '@angular/core';
import { AuthService } from '@shared';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {

  /** Is the dropdown menu open on mobile */
  public isOpen = false;

  constructor(
    private auth: AuthService
  ) {
  }

  public logOut() {
    this.auth.logOut();
  }

}
