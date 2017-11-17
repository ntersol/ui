import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";

import { Store } from '@ngrx/store';
import { IStore, StoreActionsUi,  } from '@shared';// HttpClient,
import { UISelectors } from '../stores/ui/ui.selectors';
import { ApiService } from '../api.service';


import { LogoutModalComponent, ConfirmationModalComponent } from '@components';


@Injectable()
export class UIModalService {

	/** Reference to the currently open modal. Used to interact with the open modal instance */
	public modalRef;

    /** List of all modals available in the app */
	private list = {
        // Library Components
		LogoutModalComponent: LogoutModalComponent,
		ConfirmationModalComponent: ConfirmationModalComponent,
        // App Components
	}

	constructor(
		private modalService: NgbModal,
		private select: UISelectors,
		private store: Store<IStore.root>,
		private api: ApiService
	) {
        // Subscribe to the modal in the store and launch store modal if data is found. Also make sure token is present
		this.select.modal$.subscribe((modal: any) => {
			if (modal && Object.keys(modal).length) {
				// Store reference to the modal instance
				this.modalRef = this.modalService.open(this.list[modal.modalId], modal.options);
                // Add any passed in data to the modal instance after it has opened
				if (modal.data) {
					this.modalRef.componentInstance.data = modal.data;
				}
				if (modal.data2) {
					this.modalRef.componentInstance.data2 = modal.data2;
				}
				//console.warn('Closing Modal');
				this.onClose();
			}
		});
	}

    /**
     * Open a modal window
     * @param modalId - The class name of the modal window
     * @param options - Modal options
     * @param data - Any data to pass to the modal component
     */
	public open(modalId: string, options?: any, data?: any, data2?:any): void {
		if (options && options.size == 'xl') {
			options.windowClass += ' modal-xl';
		}
		if (options && options.size == 'full') {
			options.windowClass += ' modal-full';
		}

		this.store.dispatch({ type: StoreActionsUi.MODAL_OPEN, payload: { modalId: modalId, options: options, data: data, data2: data2 } })
	}

    /**
     * When the modal window is closed, remove from store
     */
	private onClose() {
		// Wait for promise that is returned when modal is closed or dismissed
		this.modalRef.result.then((closeReason) => {
			this.store.dispatch({ type: StoreActionsUi.MODAL_UNLOAD, payload: null });
			this.api.resetErrors();
			this.api.resetSuccess();
		}, (dismissReason) => {
			// On modal dismiss, which is closed without performing an action
			this.store.dispatch({ type: StoreActionsUi.MODAL_UNLOAD, payload: null });
			this.api.resetErrors();
			this.api.resetSuccess();
		});
	}
   
}
