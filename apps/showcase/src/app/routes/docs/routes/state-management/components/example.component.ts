import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsTable } from '@ntersol/table';
import { Models } from '../../../../../shared/models';
import { StateManagementService } from '../shared/state-management.service';

@Component({
  selector: 'nts-state-management-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {
  /** Api state and data for users */
  public users$ = this.api.users.state$;
  /** Columns for table  */
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

  /** Form used to create/edit user */
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

  /** Create or edit a user */
  public isEdit = false;

  constructor(private api: StateManagementService, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Load users into the store
    this.api.users.get().subscribe();
  }

  /**
   * Save a new user or update existing
   */
  public save() {
    // Get the user out of the form
    const user = this.userForm.getRawValue() as Models.User;
    // Determine if this is a create (POST) or an update (PUT)
    const apiCall = this.isEdit ? this.api.users.put(user) : this.api.users.post(user);
    // Perform api call
    apiCall.subscribe(() => {
      // Reset form and set edit to false
      this.userForm.reset();
      this.isEdit = false;
    });
  }

  /**
   * Edit existing user
   * @param u
   */
  public edit(u: Models.User) {
    this.userForm.patchValue(u);
    this.isEdit = true;
  }

  /**
   * Cancel edit mode
   */
  public editUndo() {
    this.userForm.reset();
    this.isEdit = false;
  }

  /**
   * Delete existing user
   * @param u
   */
  public delete(u: Models.User) {
    // Confirm before deleting
    const c = confirm('Are you sure you want to delete this user?');
    if (c) {
      this.api.users.delete(u).subscribe();
    }
  }

  /**
   * Refresh data in store
   */
  public refresh() {
    this.api.users.refresh().subscribe();
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
