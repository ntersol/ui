import { Component, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public waiting = false;
  public error: {
    errorMsg?: string;
    headers?: object;
    message?: string;
    ok?: boolean;
    status?: number;
    _body?: string;
    statusText?: string;
    type?: number;
    url?: string;
  };
  public data: any; // Data is actually passed through the modal service not here
  public dataAlt: any; // Data is actually passed through the modal service not here
  public onSuccess: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Submit the form
   */
  submit() {
    this.waiting = true;
    this.error = null;
    this.activeModal.close('Success');
  } // end submit
}
