import { Injectable } from '@angular/core';
import { ntsUIStoreCreator } from '@ntersol/state-management';
import { tokenChangedAction } from './store.actions';

interface StoreModel {
  token: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class StoreComsService {
  // UI store
  public uiStore = ntsUIStoreCreator<StoreModel>({ token: null });

  constructor() {
    // Subscribe to events
    // Note that events is a Subject and will not contain historical state
    this.uiStore.events$.subscribe((action) => {
      // If an action of 'tokenChanged' comes through the events stream
      // Each action creator has a 'match' method which will only pass if the action is the correct type
      // This also ensures that the action is properly typed
      if (tokenChangedAction.match(action)) {
        // If the action passes the type check, update the store
        this.uiStore.update({ token: action.payload }); // action.payload = string | null
      }
    });
  }
}
