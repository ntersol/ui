import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject } from "rxjs";
import 'rxjs/add/operator/map';

import { Store } from '@ngrx/store';
import { IStore, StoreActionsUi } from '@shared';// HttpClient, 

import { UIModalService } from './ui/ui.modal.service';
import { UISelectors } from './stores/ui/ui.selectors';

@Injectable()
export class UIService {
    
  constructor(
	  private store: Store<IStore.root>,
    /** Select statements to retrieve data from the store  */
	  public select: UISelectors,
      /** Modal window management */
	  public modals: UIModalService
  ) {
	  if (window.localStorage.getItem('ui')) {
		  this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
	  }
  }
    
  /**  Reload the last UI state from localstorage */
  public rehydrateUI = (uiState: any) => {
	  uiState.modal = null; // Remove modal windows on reload
	  this.store.dispatch({ type: StoreActionsUi.REHYDRATE, payload: uiState }) 
  }

    
}
