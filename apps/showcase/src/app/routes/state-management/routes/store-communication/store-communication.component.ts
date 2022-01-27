import { Component, OnInit } from '@angular/core';
import { StoreComsService } from './store-communication.service';
import { ntsStore } from '@ntersol/state-management';
import { tokenChangedAction } from './store.actions';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-store-communication',
  templateUrl: './store-communication.component.html',
  styleUrls: ['./store-communication.component.scss'],
})
export class StoreCommunicationComponent implements OnInit {
  public install = `
npm i @ntersol/state-management --save`;

  public inner = `
// IE...
/shared/stores/store.actions.ts`;

  public usage1 = `
// Import action creator
import { actionCreator } from '@ntersol/state-management';

// Example of a standalone action creator with proper type
// The string just needs to be a unique value not used by any other actions
export const tokenChanged = actionCreator&lt;string | null&gt;('TOKEN_CHANGED');`;

  public usage2 = `
// Import the action creators
import { tokenChangedAction } from './store.actions';

@Injectable({
    providedIn: 'root',
})
export class StoreComsService {
    // UI store
    public uiStore = ntsUIStoreCreator&ltStoreModel&gt;({ token: null });

    constructor() {
        // Subscribe to events
        // Note that events is a Subject and will not contain historical state
        this.uiStore.events$.subscribe(action => {
            // If an action of 'tokenChanged' comes through the events stream
            // Each action creator has a 'match' method which will only pass if the action is the correct type
            // This also ensures that the action is properly typed
            if (tokenChangedAction.match(action)) {
                // If the action passes the type check, update the store
                this.uiStore.update({ token: action.payload }); // action.payload = string | null
            }
        });
    }
}`;
  public usage3 = `
  // Import the action creator
  import { tokenChangedAction } from './store.actions';

  /**
   * Update the token in the UI store
   * @param token
   */
  public tokenUpdated(token: string | null) {
    // Create an action with the appropriate payload
    const tokenAction = tokenChangedAction(token);
    // Dispatch the action to a store. Note that all stores receive all actions regardless of where it was dispatched
    this.svc.uiStore.dispatch(tokenAction);
  }`;

  public usage4 = `
  // Import the base store instance
  import { ntsStore } from '@ntersol/state-management';

  /**
   * Update the token in the UI store
   * @param token
   */
  public tokenUpdated(token: string | null) {
    // Create an action with the appropriate payload
    const tokenAction = tokenChangedAction(token);
    // Dispatch the action to the base store instance. Note that all stores receive all actions regardless of where it was dispatched
    ntsStore.dispatch(tokenAction);
  }`;

  public token: string | null = null;
  public token$ = this.svc.uiStore.select$('token');

  constructor(public svc: StoreComsService, private highlight: HighlightService) {}

  ngOnInit(): void {}

  /**
   * Update the token in the UI store
   * @param token
   */
  public tokenUpdate(token: string | null) {
    // Create an action with the appropriate payload
    const tokenAction = tokenChangedAction(token);
    // Dispatch the action to a store. Note that all stores receive all actions regardless of where it was dispatched
    this.svc.uiStore.dispatch(tokenAction);
  }

  /**
   * Update the token in the UI store
   * @param token
   */
  public tokenUpdated2(token: string | null) {
    // Create an action with the appropriate payload
    const tokenAction = tokenChangedAction(token);
    // Dispatch the action to a store. Note that all stores receive all actions regardless of where it was dispatched
    ntsStore.dispatch(tokenAction);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
