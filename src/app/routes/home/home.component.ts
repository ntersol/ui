import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Datagrid } from '@mello-labs/datagrid';

import { ApiService, ApiProps } from '$api';
import { UIStoreService } from '$ui';
import { Models } from '$models';
import { DesktopUtils } from '$utils';
import { columns } from './columns';
import { HomeService } from './shared/home.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public users$ = this.api.select.users$;
  public usersState$ = this.api.select.getState$(ApiProps.users);
  public formMain: FormGroup;
  public isEditing: boolean;

  public filterGlobal: Datagrid.FilterGlobal = {
    term: '',
    props: ['name', 'website'],
  };

  // Inputs
  public options: Datagrid.Options = {
    scrollbarH: true,
    selectionType: 'single',
    fullScreen: true,
    controlsDropdown: true,
    showInfo: true,
    primaryKey: 'id',
  };

  public columns: Datagrid.Column[] = columns;

  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(private api: ApiService, public ui: UIStoreService, private fb: FormBuilder, public home: HomeService) {}

  public ngOnInit() {
    // Get users and load into store
    this.api.users.get().subscribe();

    // Formgroup
    this.formMain = this.fb.group({
      address: ['', []],
      company: ['', []],
      email: ['', []],
      id: ['', []],
      name: ['', [Validators.required]],
      phone: ['', []],
      username: ['', [Validators.required]],
      website: ['', []],
    });
  }

  /**
   * Refresh users
   */
  public usersRefresh() {
    this.api.users.get(true).subscribe();
  }

  /**
   * Update the global filter term
   * @param searchTerm
   */
  public onfilterGlobal(searchTerm: string = null) {
    this.filterGlobal = { ...this.filterGlobal, term: searchTerm };
  }

  /**
   * Stop editing to create a new user
   */
  public userStopEdit() {
    this.formMain.reset();
    this.isEditing = false;
  }

  /**
   * Load user into editing pane
   * @param user
   */
  public userEdit(user: any) {
    this.formMain.patchValue(user);
    this.isEditing = true;
  }

  /**
   * Delete user
   * @param user
   */
  public userDelete(user: any) {
    this.api.users.delete(user).subscribe();
  }

  /**
   * When the state has been changed (grouping/filtering/sorting/etc)
   * @param event
   */
  public onStateChange(/** state: Datagrid.State */) {
    // console.log('onStateChange', JSON.stringify(state));
  }

  /**
   * When rows have been selected
   * @param event
   */
  public onRowsSelected(users: Models.User[]) {
    if (users && users[0]) {
      this.formMain.patchValue(users[0]);
      this.isEditing = true;
      DesktopUtils.copyToClipboard(users[0].phone); // Copy phone number to clipboard
    }
  }

  /**
   * When a row has been edited
   * @param event
   */
  public onRowUpdated(/** users: Models.User[] */) {
    // console.log('onRowUpdated', users);
  }

  /**
   * Create/update user
   */
  public userSubmit() {
    // If editing, use put
    if (this.isEditing) {
      this.api.users.put(this.formMain.value).subscribe(() => {
        this.formMain.reset(); // Reset form after completion
        this.isEditing = false;
      });
    } else {
      // If creating, use post
      this.api.users.post(this.formMain.value).subscribe(() => this.formMain.reset());
    }
  }

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    } // Unsub
  }
}
