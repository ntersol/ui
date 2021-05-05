import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NtsTable } from '@ntersol/table';
import { Models } from '../../../../shared/models';
import { HighlightService } from '../../shared/services/highlight.service';
import { StateManagementService } from './shared/state-management.service';

@Component({
  selector: 'nts-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit {
  public columns: NtsTable.Column<Models.User>[] = [
    {
      field: 'name',
      header: 'Name',
    },
    {
      field: 'email',
      header: 'Eame',
    },
    {
      field: 'phone',
      header: 'Phone',
    },
  ];
  public users$ = this.api.users.state$;

  public import = `import { NtsStateManagementModule } from '@ntersol/state-management';`;

  public install = `
  npm i @ntersol/state-management --save`;

  public usage = `
  // In your api service
  import { ntsApiStore } from &#39;@ntersol/state-management&#39;;

  @Injectable({
    providedIn: &#39;root&#39;,
  })
  export class SampleService {
    // Create a curried store creator instance with default settings
    private store = ntsApiStore(this.http, { apiUrlBase: &#39;//jsonplaceholder.typicode.com&#39; });
    // Create an instance of an entity based store
    public users = this.store&lt;Models.User&gt;({ apiUrl: &#39;/users&#39; });
    // Create an instance of a non-entity based store
    public post = this.store&lt;Models.Post&gt;({ apiUrl: &#39;/posts/1&#39; }, false);

    // List all store services here
    constructor(public http: HttpClient) {}
  }`;

  public usage2 = ``;

  constructor(private api: StateManagementService, private highlight: HighlightService) {}

  ngOnInit(): void {
    this.api.users.get().subscribe();
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
