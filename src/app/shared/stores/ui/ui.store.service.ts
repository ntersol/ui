import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '$env';
import { AppStore } from '$shared';
import { StringUtils } from '$utils';
import { UIStoreActions } from './ui.actions';
import { UiSelectorsService } from './ui.selectors.service';

@Injectable({
  providedIn: 'root',
})
export class UIStoreService {
  private pad = 100;

  /** Holds the reference to a window opened programmatically. Used by appComms for multiscreen state */
  public screen: Window;

  constructor(
    private store: Store<AppStore.Root>,
    /** UI Store Selectors */
    public select: UiSelectorsService,
  ) {
    // Rehydrate UI state from localstorage on instantiation
    if (window.localStorage.getItem('ui')) {
      // Get UI state from localstorage
      let str = window.localStorage.getItem('ui');
      // Remove obfusucation if is set
      if (environment.settings.obfuscate) {
        str = StringUtils.obfuscateRemove(str);
        str = StringUtils.trim(str, this.pad, this.pad);
      }
      // Convert to JSON
      const uiState: AppStore.Ui = JSON.parse(str);
      this.storeStateRestore(uiState);
    }

    // On UI store changes, persist to localstorage
    this.select.saveState$.subscribe((uiState: AppStore.Ui) => this.storeStateSave(uiState));
  }

  /**
   * Change the visible tab of a tabset
   * USAGE: <ngb-tabset (tabChange)="ui.tabChange('HOME',$event)" [activeId]="ui.select.tabActive$('HOME') | async">
   * Make sure all tabs have an id: <ngb-tab id="tab-1">
   * @param tabInstanceId - A name or unique identifier for this tab instance
   * @param tabId - The tabChange event supplied by ng-boostrap
   */
  public tabChange(tabInstanceId: string, tabId: NgbTabChangeEvent) {
    this.store.dispatch(UIStoreActions.TAB_CHANGE({ tabInstanceId: tabInstanceId, tabId: tabId.nextId }));
  }

  /**
   * Toggle multiscreen view
   */
  public multiScreenToggle(multiScreen: boolean | null = null) {
    this.store.dispatch(UIStoreActions.MULTISCREEN_TOGGLE(multiScreen));
  }

  /**
   *  Reload the latest UI state from localstorage
   */
  public storeStateRestore = (uiState: AppStore.Ui) => {
    this.store.dispatch(UIStoreActions.REHYDRATE(uiState));
  }

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
      let str = JSON.stringify(state);
      // Add obfusciation if set
      if (environment.settings.obfuscate) {
        str = StringUtils.pad(str, this.pad, this.pad);
        str = StringUtils.obfuscateAdd(str);
      }
      // Set to localstorage
      window.localStorage.setItem('ui', str);
    }
  }
}
