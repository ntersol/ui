import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UIService } from '@shared';
import { Subscription } from 'rxjs/Subscription';
/**
<launch-modal [isButton]="false" classes="btn btn-icon" modal="LoanDetailsModalComponent" size="lg" [data]="someData" [dataAlt]="someData"
    (onSuccess)="doSomething($event)">
                    <div class="icons-app icons-app-loan_info"></div>
</launch-modal>
*/

@Component({
  selector: 'launch-modal',
  template: `<button class="{{classes}}" (click)="openModal()" *ngIf="isButton" [disabled]="disabled">
                <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
            </button>
            <a class="{{classes}}" (click)="openModal()" *ngIf="!isButton" [ngClass]="{'disabled': disabled }">
                <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
            </a>
            <ng-template #contentTpl><ng-content></ng-content></ng-template>`
})
export class LaunchModalComponent implements OnInit, OnDestroy {
    /** Is this a button tag or an a link */
	@Input() isButton: boolean = true; // 
    /** The modal component name to launch */
	@Input() modal: string;
	/** Should the modal persist on reload */
	@Input() persist: boolean = false; 
    /** Any model data that needs to be passed to the modal component */
	@Input() data: any;
	/** Any model data that needs to be passed to the modal component */
	@Input() dataAlt: any;
    /** CSS classes to apply to the button */
	@Input() classes: string = ''; // 
    /** Default size of the modal, can be sm/md/lg/xl/full */
	@Input() size: 'sm' | 'lg' | 'xl' | 'full' = 'lg'; 
    /** Is the button or a tag disabled */
	@Input() disabled: boolean = false;
    /** Add a class to the window object */
	@Input() windowClass: string = '';

    @Output() onSuccess: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent
	@Output() onDismiss: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent

	private sub: Subscription;

	constructor(
		private modalService: NgbModal,
		private ui: UIService
	) {
	}

	ngOnInit() {	}

	
    /**
    * Open a modal window
    * Attach a success function and pass any relevant data to the modal component
    */
	public openModal() {
		if (this.size == 'xl'){
			this.windowClass += ' modal-xl';
		}
		if (this.size == 'full') {
			this.windowClass += ' modal-full';
		}

		let modal = this.ui.modals.open(<any>this.modal, this.persist, this.size, this.data, this.dataAlt);
        // If static modal
		if (modal) {
			modal.result.then(
				reason => this.onSuccess.emit(reason),
				reason => this.onDismiss.emit(reason));
		}
        // If observable modal. KNOWN BUG: If the page is refreshed and the app is dependent on an onSuccess method, that method will not be persisted
		else {
			this.sub = this.ui.modals.modalRef$.subscribe(modal => {
				if (modal){
				    modal.result.then(
					    reason => this.onSuccess.emit(reason),
					    reason => this.onDismiss.emit(reason));
				}
			});
		}
    }//end openModal

	ngOnDestroy() {
		if (this.sub){
			this.sub.unsubscribe(); // Unsub from modal observable
		}
	}

}
