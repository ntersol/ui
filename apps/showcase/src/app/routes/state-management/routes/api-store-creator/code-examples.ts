export const install = `
  npm i @ntersol/state-management --save`;

export const importExample = `
  import { NtsStateManagementModule } from '@ntersol/state-management';`;

export const usage1 = `
  import {  NtsStateManagementService } from '@ntersol/state-management';

  @Injectable({
    providedIn: &#39;root&#39;,
  })
  export class SampleService {
    // Create a curried store creator instance with default settings
    private store = this.sms.createBaseStore({ apiUrlBase: '//jsonplaceholder.typicode.com' });
    // Create an instance of an entity based store. Inherits configuration from base store
    public users = this.store<Models.User>({ uniqueId: 'id', storeId: StoreIds.USERS, apiUrl: '/users' });
    // Create an instance of a non-entity based store. Inherits configuration from base store
    public post = this.store<Models.Post>({ apiUrl: '/posts/1' });

    constructor(public sms: NtsStateManagementService) {}
  }`;

export const usage2 = `
  export class SampleComponent implements OnInit {
    // Get both users and api state
    public users$ = this.api.users.state$;
    // Import service into component
    constructor(private api: SampleService) {}

    ngOnInit() {
      // Load data into the store if autoload is disabled
      this.api.users.get().subscribe();
      // Refresh data manually
      this.api.users.refresh().subscribe();
    }

    // Create a new entity via POST
    public create(e: Models.User) {
      this.api.users.post(e).subscribe();
    }

    // Update an existing entity via PUT
    public update(e: Models.User) {
      this.api.users.put(e).subscribe();
    }

    // Remove a user via DELETE
    public delete(e: Models.User) {
      this.api.users.delete(e).subscribe();
    }
  }`;

export const usage3 = `
&lt;nts-api-state [state]=&quot;users&quot; *ngIf=&quot;users$ | async as users&quot;&gt;
  &lt;ng-container *ngIf=&quot;users?.data?.length; else noData&quot;&gt;
    &lt;ng-container *ngFor=&quot;let user of users.data&quot;&gt;
      &lt;!-- Output User data here--&gt;
    &lt;/ng-container&gt;
  &lt;/ng-container&gt;
  &lt;ng-template #noData&gt; No users found &lt;/ng-template&gt;
&lt;/nts-api-state&gt;`;

export const state = `
// Subscribe to the state property on the store
public users$ = this.myStore.state$; // state$ is an instance of ApiState

...

/** state$ contains both the api state and any data */
export interface ApiState<t = any, e = any> {
  [key: string]: any;
  loading: boolean; // When the app performing a GET request
  modifying: boolean; // When the app is performing a POST/PUT/PATCH/DELETE operation
  error: null | e; // An error returned from a GET operation
  errorModify: null | e; // An error from a POST/PUT/PATCH/DELETE operation
  data: null | t | t[]; // Data is stored here. If an entity store then this will be an array of entities
}

/** Entity stores have an additional property with entity data stored as a record by unique ID */
export interface EntityApiState<t = any, e = any> extends ApiState<t[], e> {
  entities: Record<string | number, t>;
}`;

export const select = `
/**
 * Entity Stores
 */
// Subscribe to both state and data
public usersState$ = this.myStore.state$; // Will be type EntityApiState<t>

// Subscribe to both state and data, pass a callback function to modify the response from the store while still retaining state. Will modify both .data and .entities
public usersStateSelect$ = this.myStore.stateSelect$(data => data?.filter(user => user.id > 5) || null) // Will be type EntityApiState<t>

// Subscribe to all data in the store without state
public usersAll$ = this.myStore.selectAll$; // Will be type t[]

// Subscribe to a single record from the store without state. Uses the unique ID.
public usersOne$ = this.myStore.selectOne$('12345'); // Will be type t

// Pass a callback statement to the select$ observable to modify the response from the store without state
public usersLess$ = this.myStore.select$(data => data?.filter(user => user.id > 5) || null); // Will be type t[]

/**
 * Non-entity Stores
 */
// Subscribe to the store data without state
public user$ = this.myStore.select$;`;
