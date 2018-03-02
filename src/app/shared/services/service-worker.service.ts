import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { UIModalService } from '@ui';
import { environment } from '../../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';

@Injectable()
export class ServiceWorkerService {
  /** Is SW enabled by environent props? */
  public isEnabled = environment.serviceWorker;
  /** Notify app when a new version is available */
  public updateAvailable$ = new BehaviorSubject(false);
  /** Has the modal been popped already */
  private modalPopped = false;
  /** Holds set interval */
  private counter;

  constructor(
    private sw: SwUpdate,
    private modals: UIModalService,
    private zone: NgZone
  ) {

    if (this.sw.isEnabled && environment.serviceWorker) {
      //console.log('Service worker enabled');

      // On initial load, check if service worker is available first
      this.sw.available.subscribe(() => {
        //console.log('Update available');
        this.updateAvailable$.next(true);
        window.clearInterval(this.counter);
      });

      // For some reason, running the interval inside Angular prevents the SW from registering
      // Running the interval outside the zone fixes this
      this.zone.runOutsideAngular(() => {
        this.counter = window.setInterval(() => {
          this.zone.run(() => {
            //console.log("Checking for new version of the app 7");
            this.sw.checkForUpdate();
          });
        }, 5000 * 60); 
      });
    }
  }

  public openModal() {
    this.modals.open('ConfirmationModalComponent', false, 'lg',
      `A new version of ${environment.appName} is available, would you like to update to the latest version?`)
      .result.then(
      () => this.sw.activateUpdate(),
      () => console.warn('User is on an outdated version of the application'));
    this.modalPopped = true;
  }

}
