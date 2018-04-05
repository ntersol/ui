import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';
import { environment } from '@env';

@Injectable()
export class UIStoreService {
  /** Collection of UI store selectors. Can be moved to own service if this gets too big */
  public selectors = {
    uiState$: this.store.select(store => store.ui),
    modal$: this.store.select(store => store.ui.modal),
    multiScreen$: this.store.select(store => store.ui.multiScreen),
  };

  /** Holds the reference to a window opened programmatically. Used by appComms for multiscreen state */
  public screen: Window;

  constructor(private store: Store<AppStore.Root>) {
    // Rehydrate UI state from localstorage
    if (window.localStorage.getItem('ui')) {
      this.storeStateRestore(JSON.parse(window.localStorage.getItem('ui')));
    }

    // On UI store changes, persist to localstorage
    this.selectors.uiState$.subscribe(uiState => this.storeStateSave(uiState));
  }

  /**
   * Toggle multiscreen view
   */
  public multiScreenToggle(multiScreen: boolean | null = null) {
    this.store.dispatch({ type: UIStoreActions.MULTISCREEN_TOGGLE, payload: multiScreen });
  }

  /**  Reload the latest UI state from localstorage */
  public storeStateRestore = (uiState: any) => {
    this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
  };

  /**
   * Save the UI store state to localstorage for persistance
   * @param state
   */
  private storeStateSave(state: AppStore.Ui) {
    /** Which properties of the store properties to NOT persist or save to local storage */
    const stateNew: any = { ...state };
    // Delete any keys that should not be persisted
    for (const key in stateNew) {
      if (stateNew.hasOwnProperty(key) && environment.state.uiStoreBlacklist.indexOf(key) !== -1 && stateNew[key]) {
        delete stateNew[key];
      }
    }
    window.localStorage.setItem('ui', JSON.stringify(stateNew));
  }
}
