import { Injectable } from '@angular/core';
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
	    this.store.dispatch({ type: StoreActionsUi.REHYDRATE, payload: uiState }) 
    }

    
}
