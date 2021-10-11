export const install = `
  npm i @ntersol/state-management --save`;

export const importExample = `
  import { NtsStateManagementModule } from '@ntersol/state-management';`;

export const usage1 = `
  import { ntsApiStoreCreator } from &#39;@ntersol/state-management&#39;;
  import { HttpClient } from &#39;@angular/common/http&#39;;

  @Injectable({
    providedIn: &#39;root&#39;,
  })
  export class SampleService {
    // Create a curried store creator instance with default settings
    private store = ntsApiStoreCreator(this.http, { apiUrlBase: &#39;//jsonplaceholder.typicode.com&#39; });
    // Create an instance of an entity based store
    public users = this.store&lt;Models.User&gt;({ apiUrl: &#39;/users&#39; });
    // Create an instance of a non-entity based store
    public post = this.store&lt;Models.Post&gt;({ apiUrl: &#39;/posts/1&#39; }, false);

    constructor(public http: HttpClient) {}
  }`;

export const usage2 = `
  export class SampleComponent implements OnInit {
    // Get both users and api state
    public users$ = this.api.users.state$;
    // Get just the data without state
    public userData$ = this.api.users.data$;
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
