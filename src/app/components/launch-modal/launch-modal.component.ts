import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UIModalService } from '$ui';

/** Sample Usage:
<app-launch-modal  classes="btn btn-icon"
    modal="LoanDetailsModalComponent" size="lg" [data]="someData" [dataAlt]="someData" [isButton]="false"
    (onSuccess)="doSomething($event)">
        <div class="icons-app icons-app-loan_info"></div>
</app-launch-modal>
*/

@Component({
  selector: 'app-launch-modal',
  template: `<button class="{{classes}}" (click)="openModal()" *ngIf="isButton" [disabled]="disabled">
                <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
            </button>
            <a class="{{classes}}" (click)="openModal()" *ngIf="!isButton" [ngClass]="{'disabled': disabled }">
                <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
            </a>
            <ng-template #contentTpl><ng-content></ng-content></ng-template>`,
})
export class LaunchModalComponent implements OnInit, OnDestroy {
  /** Is this a button tag or an a link */
  @Input() isButton = true; //
  /** The modal component name to launch */
  @Input() modal: string;
  /** Should the modal persist on reload */
  @Input() persist = false;
  /** Any model data that needs to be passed to the modal component */
  @Input() data: any;
  /** Any model data that needs to be passed to the modal component */
  @Input() dataAlt: any;
  /** CSS classes to apply to the button */
  @Input() classes = ''; //
  /** Default size of the modal, can be sm/md/lg/xl/full */
  @Input() size: 'sm' | 'lg' | 'xl' | 'full' = 'lg';
  /** Is the button or a tag disabled */
  @Input() disabled = false;
  /** Add a class to the window object */
  @Input() windowClass = '';

  @Output() success: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent
  @Output() dismiss: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent

  private sub: Subscription;

  constructor(private modals: UIModalService) {}

  ngOnInit() {}

  /**
   * Open a modal window
   * Attach a success function and pass any relevant data to the modal component
   */
  public openModal() {
    if (this.size === 'xl') {
      this.windowClass += ' modal-xl';
    }
    if (this.size === 'full') {
      this.windowClass += ' modal-full';
    }

    const modal = this.modals.open(<any>this.modal, this.persist, this.size, this.data, this.dataAlt);
    // If static modal
    if (modal) {
      modal.result.then(reason => this.success.emit(reason), reason => this.dismiss.emit(reason));
    } else {
      // If observable modal. KNOWN BUG: If the page is refreshed and the app is dependent on an onSuccess method
      // that method will not be persisted
      this.sub = this.modals.modalRef$.subscribe(modalElem => {
        if (modalElem) {
          modalElem.result.then((reason: any) => this.success.emit(reason), (reason: any) => this.dismiss.emit(reason));
        }
      });
    }
  } // end openModal

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe(); // Unsub from modal observable
    }
  }
}
