import { Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'confirmation-modal',
    templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent implements OnInit {

    private ngUnsubscribe: Subject<void> = new Subject<void>(); // Holds observables to unsub from
    public waiting: boolean = false;
    public error: IErrorApi;
    public data: any; // Data is actually passed through the modal service not here

	public onSuccess: EventEmitter<any> = new EventEmitter();

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }
    
    /**
     * Submit the form
     */
    submit() {
        this.waiting = true;
		    this.error = null;
		    this.activeModal.close('Success');
    }//end submit

    public ngOnDestroy() {
        // Cancel/Unsub from all observables when this component is destroyed
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    
}
