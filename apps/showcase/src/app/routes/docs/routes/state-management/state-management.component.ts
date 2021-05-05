import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsTable } from '@ntersol/table';
import { Models } from '../../../../shared/models';
import { HighlightService } from '../../shared/services/highlight.service';
import { importExample, install, usage1, usage2, usage3 } from './code-examples';
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
      header: 'Email',
    },
    {
      field: 'phone',
      header: 'Phone',
    },
    {
      field: 'actions',
      header: 'Actions',
    },
  ];
  public users$ = this.api.users.state$;

  public install = install;
  public importExample = importExample;
  public usage1 = usage1;
  public usage2 = usage2;
  public usage3 = usage3;

  public userForm = this.fb.group({
    address: [],
    company: [],
    email: [],
    id: [],
    name: [],
    phone: [],
    username: [],
    website: [],
  });

  public isEdit = false;

  constructor(private api: StateManagementService, private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.api.users.get().subscribe();
  }

  public save() {
    const user = this.userForm.getRawValue() as Models.User;
    const apiCall = this.isEdit ? this.api.users.put(user) : this.api.users.post(user);
    apiCall.subscribe(() => this.userForm.reset());
  }

  public edit(u: Models.User) {
    this.userForm.patchValue(u);
    this.isEdit = true;
  }

  public editUndo() {
    this.userForm.reset();
    this.isEdit = false;
  }

  public delete(u: Models.User) {
    const c = confirm('Are you sure you want to delete this user?');
    if (c) {
      this.api.users.delete(u).subscribe();
    }
  }

  public refresh() {
    this.api.users.refresh().subscribe();
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}

/**
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

  // Refresh data manually
  public refresh() {
    this.api.users.refresh().subscribe();
  }
}
 */
