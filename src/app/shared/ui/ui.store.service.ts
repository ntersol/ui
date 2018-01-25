import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

@Injectable()
export class UIStoreService {

		public modal$ = this.store.select(store => store.ui.modal);

		constructor(
				private store: Store<IStore.root>
		) {
				if (window.localStorage.getItem('ui')) {
						this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
				}
		}

		/**  Reload the last UI state from localstorage */
		public rehydrateUI = (uiState: any) => {
				this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
		}


}
