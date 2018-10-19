import { Component, OnInit, OnDestroy } from '@angular/core';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
})
export class LogoutModalComponent implements OnInit, OnDestroy {
  public logoutTimer$: Subscription; // Holds the countdown obserable
  public counter: number; // Log out after this many seconds
  // public modalDuration: number = 120; // This number is passed in through the modal reference, will default to 120 if not specified
  public data = 120; // Data is actually passed through the modal service not here
  public dataAlt: any; // Data is actually passed through the modal service not here

  constructor() {}

  ngOnInit() {
    this.counter = this.data; // How long to display the modal window

    // Create a timer obserable that counts down
    this.logoutTimer$ = interval(1000).subscribe(() => {
      // If timer is greater than 0, count down.
      if (this.counter > 1) {
        this.counter--;
      } else {
        // If timer hits zero or below, CLOSE this modal which toggles the logout action in AuthService
        this.logoutTimer$.unsubscribe();
        //this.activeModal.close();
      }
    });
  }

  public ngOnDestroy() {
    this.logoutTimer$.unsubscribe(); // Unsub from timer on modal close
  }
}
