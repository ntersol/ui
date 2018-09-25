import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataGridComponent } from '../../libs/datagrid/components/datagrid.component';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { Models } from '$models';
import { DesktopUtils } from '$utils';
import { columns } from './columns';
import { Datagrid, ContextService, ContextMenuList } from '$libs';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('datagrid') datagrid: DataGridComponent;

  public users$ = this.api.select.users$;
  public sidebarOpen$ = this.ui.select.sidebarOpen$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

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
  /** selected rows */
  private rowsSelected: Models.User[];
  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    public ui: UIStoreService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private contextSvc: ContextService,
  ) {}

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

  /** Toggle the sidebar */
  public sidebarToggle(toggle: boolean) {
    this.ui.sidebarToggle(!toggle);
    // There is a better way of doing this
    setTimeout(() => {
      this.datagrid.viewCreate();
      this.ref.detectChanges();
    });
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
  public userEdit(user: Models.User) {
    this.formMain.patchValue(user);
    this.isEditing = true;
  }

  /**
   * Delete user
   * @param user
   */
  public userDelete(user: Models.User) {
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
  public onRowsSelected(rows: Models.User[]) {
    if (rows && rows[0]) {
      this.rowsSelected = rows;
      this.formMain.patchValue(rows[0]);
      this.isEditing = true;
      DesktopUtils.copyToClipboard(rows[0].phone); // Copy phone number to clipboard
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
   * Open a context menu on right click
   * @param $event
   */
  public contextMenu($event: MouseEvent) {
    this.contextSvc.open(ContextMenuList.home, $event, this.rowsSelected);
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
