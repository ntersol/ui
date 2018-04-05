import { Component } from '@angular/core';
import { AuthService, ServiceWorkerService } from '$shared';

import { environment } from '$env';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent {
  /** Is the dropdown menu open on mobile */
  public isOpen = false;

  // Is the service worker enabled
  public hasSW = environment.settings.enableServiceWorker;
  // Does the app have an update
  public hasUpdate$ = this.sw.updateAvailable$;

  constructor(private auth: AuthService, private sw: ServiceWorkerService) {}

  public updateApp() {
    this.sw.openModal();
  }

  public logOut() {
    this.auth.logOut(true);
  }
}
