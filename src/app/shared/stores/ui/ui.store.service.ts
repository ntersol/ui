import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '$env';
import { AppStore } from '$shared';
import { UIStoreActions } from './ui.actions';
import { UiSelectorsService } from './ui.selectors.service';

@Injectable()
export class UIStoreService {
  /** Holds the reference to a window opened programmatically. Used by appComms for multiscreen state */
  public screen: Window;

  constructor(
    private store: Store<AppStore.Root>,
    /** UI Store Selectors */
    public select: UiSelectorsService,
  ) {
    // Rehydrate UI state from localstorage on instantiation
    if (window.localStorage.getItem('ui')) {
      this.storeStateRestore(JSON.parse(window.localStorage.getItem('ui')));
    }

    // On UI store changes, persist to localstorage
    this.select.saveState$.subscribe(uiState => this.storeStateSave(uiState));
  }

  /**
   * Change the visible tab of a tabset
   * USAGE: <ngb-tabset (tabChange)="ui.tabChange('HOME',$event)" [activeId]="ui.select.tabActive$('HOME') | async">
   * Make sure all tabs have an id: <ngb-tab id="tab-1">
   * @param tabInstanceId - A name or unique identifier for this tab instance
   * @param tabId - The tabChange event supplied by ng-boostrap
   */
  public tabChange(tabInstanceId: string, tabId: NgbTabChangeEvent) {
    this.store.dispatch({
      type: UIStoreActions.TAB_CHANGE,
      payload: { tabInstanceId: tabInstanceId, tabId: tabId.nextId },
    });
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
    if (state) {
      // Delete any keys that should not be persisted
      for (const key in state) {
        if (state.hasOwnProperty(key) && environment.state.uiStoreBlacklist.indexOf(key) !== -1 && (<any>state)[key]) {
          delete (<any>state)[key];
        }
      }
      window.localStorage.setItem('ui', JSON.stringify(state));
    }
  }
}
