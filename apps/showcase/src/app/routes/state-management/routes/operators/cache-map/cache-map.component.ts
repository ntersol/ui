import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { cacheMap } from '@ntersol/state-management';
import { BehaviorSubject, filter } from 'rxjs';
import { Models } from '../../../../../shared/models';
import { HighlightService } from '../../../../../shared/services/highlight.service';
import { StateManagementService } from '../../../shared/state-management.service';

@Component({
  selector: 'nts-cache-map',
  templateUrl: './cache-map.component.html',
  styleUrls: ['./cache-map.component.scss'],
})
export class CacheMapComponent implements OnInit {
  public install = `
  npm i @ntersol/state-management --save`;

  public inner = `
  // Import
  import { cacheMap } from '@ntersol/state-management';

  // Usage
  public user$ = this.userID$.pipe(
    cacheMap((userID) => this.http.get<Models.User>('//jsonplaceholder.typicode.com/users/\${userID}')),
  )

  // Example with options. Cache will expire after 60 seconds.
  public user$ = this.userID$.pipe(
    cacheMap((userID) => this.http.get<Models.User>('//jsonplaceholder.typicode.com/users/\${userID}', {ttl: 60})),
  )`;

  public usage1 = `
  type Options<t> = {
    /** How long should this response belong in the cache in seconds */
    ttl?: number | null | undefined;
    /** Supply a function that returns the upstream data and expects a string to use as a unique ID. Overrides the default ID handling and is useful for scenarios where the upstream data is a non-primitive */
    uniqueIdFn?: (val: t) => string | number;
  };`;

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
    import { NtsStateManagementService } from '@ntersol/state-management';
    // Import the action creator
    import { tokenChangedAction } from './store.actions';

    constructor(public sms: NtsStateManagementService) {}
    /**
     * Update the token in the UI store
     * @param token
     */
    public tokenUpdated(token: string | null) {
      // Create an action with the appropriate payload
      const tokenAction = tokenChangedAction(token);
      // Dispatch the action to the base store instance. Note that all stores receive all actions regardless of where it was dispatched
      this.sms.dispatch.dispatch(tokenAction);
    }`;

  public userID$ = new BehaviorSubject<number | null>(null);

  public user$ = this.userID$.pipe(
    filter((x) => !!x),
    cacheMap((userID) => this.http.get<Models.User>(`//jsonplaceholder.typicode.com/users/${userID}`)),
  );

  public users$ = this.api.users.selectAll$;

  constructor(private highlight: HighlightService, private http: HttpClient, private api: StateManagementService) {}

  ngOnInit(): void {}

  public updateUser(id: number) {
    this.userID$.next(id);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
