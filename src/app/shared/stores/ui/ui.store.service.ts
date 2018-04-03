import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

@Injectable()
export class UIStoreService {
  public selectors = {
    // selectors$: this.store.select(store => store.ui.modal);
  };

  public modal$ = this.store.select(store => store.ui.modal);

  constructor(private store: Store<IStore.root>) {
    // Rehydrate UI state from localstorage
    if (window.localStorage.getItem('ui')) {
      this.storeStateRestore(JSON.parse(window.localStorage.getItem('ui')));
    }

    // On UI store changes, persist to localstorage
    this.store.select(storeRoot => storeRoot.ui).subscribe(uiState => this.storeStateSave(uiState));
  }

  /**
   * Save the UI store state to localstorage for persistance
   * @param state
   */
  private storeStateSave(state: IStore.ui) {
    /** Which properties of the store properties to NOT persist or save to local storage */
    const ignoreProps = ['loanHasUpdate', 'forms'];
    const stateNew: any = { ...state };
    // Delete any keys that should not be persisted
    for (const key in stateNew) {
      if (stateNew.hasOwnProperty(key) && ignoreProps.indexOf(key) !== -1 && stateNew[key]) {
        delete stateNew[key];
      }
    }
    window.localStorage.setItem('ui', JSON.stringify(stateNew));
  }

  /**  Reload the last UI state from localstorage */
  public storeStateRestore = (uiState: any) => {
    this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
  };
}
