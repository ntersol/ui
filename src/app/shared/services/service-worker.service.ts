import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { UIModalService } from '@ui';
import { environment } from '../../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ServiceWorkerService {
  
  /** Is SW enabled by environent props? */
  public isEnabled = environment.serviceWorker;
  /** Notify app when a new version is available */
  public updateAvailable$ = new BehaviorSubject(false);
  /** Holds set interval */
  private counter: any;
  /** Check for update this many minutes */
  private checkInterval = 5; //
  /** Has the modal been popped already? */
  private modalPopped = false;

  constructor(private sw: SwUpdate, private modals: UIModalService, private zone: NgZone) {
  }

  /**
   * Start polling for SW updates
   */
  public pollForUpdates() {
    if (this.sw.isEnabled) {

      // On initial load, check if service worker is available first
      this.sw.available.subscribe(() => {
        //console.log('Update available');
        this.updateAvailable$.next(true);
        window.clearInterval(this.counter);
        if (!this.modalPopped) {
          this.openModal();
        }
      });

      // For some reason, running the interval inside Angular prevents the SW from registering
      // Running the interval outside the zone fixes this
      this.zone.runOutsideAngular(() => {
        this.counter = window.setInterval(() => {
          this.zone.run(() => {
            //console.log("Checking for new version of the app 7");
            this.sw.checkForUpdate();
          });
        }, this.checkInterval * 1000 * 60);
      });
    }
  }

  public openModal() {
    this.modals
      .open(
      'ConfirmationModalComponent',
      false,
      'lg',
      `A new version of ${environment.appName} is available, would you like to update to the latest version?`,
    )
      .result.then(
      () => this.sw.activateUpdate(),
      () => console.warn('User is on an outdated version of the application'),
    );
  }
}
