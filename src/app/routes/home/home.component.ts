import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions, ColumnApi } from 'ag-grid-community';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { Models } from '$models';
// import { DesktopUtils } from '$utils';
import { columns } from './columns';
import { ContextService, ContextMenuList, GridStatusBarComponent, GridTemplateRendererComponent } from '$libs';

declare interface GridState {
  columns?: any;
  groups?: any;
  sorts?: any;
  filters?: any;
}

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('grid') grid: AgGridNg2;
  @ViewChild('phone') cellTemplatePhone: TemplateRef<any>;

  public gridColumnApi: ColumnApi;
  public gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [{ statusPanel: 'statusBarComponent', align: 'left' }],
    },
  };
  public gridState: GridState = {};
  public frameworkComponents = { statusBarComponent: GridStatusBarComponent };
  public gridLoaded = false;

  public users$ = this.api.select.users$;
  public sidebarOpen$ = this.ui.select.sidebarOpen$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

  public filterGlobalTerm = '';

  public columns = columns;

  private gridStatusComponent: GridStatusBarComponent;
  /** selected rows */
  private rowsSelected: Models.User[];
  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    public ui: UIStoreService,
    private fb: FormBuilder,
    // private ref: ChangeDetectorRef,
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

  ngAfterViewInit() {
    // Attach custom tell templates to the appropriate column
    const columns = this.columns.map(column => {
      if (column.field === 'phone') {
        column.cellRendererFramework = GridTemplateRendererComponent;
        column.cellRendererParams = {
          ngTemplate: this.cellTemplatePhone,
          // grouping: () => { } // TODO: Custom renderer for group headers
        };
      }
      return column;
    });
    this.gridOptions.api.setColumnDefs(columns);
  }

  /**
   * When the grid is ready
   * @param params
   */
  public gridReady(params: any) {
    // console.log(params)
    this.gridColumnApi = params.columnApi;
    // Set reference to status component so state can be pushed
    this.gridStatusComponent = (<any>this).gridOptions.api
      .getStatusPanel('statusBarComponent')
      .getFrameworkComponentInstance();

    this.gridStateRestore();
  }

  /** After the grid has loaded data */
  public gridFirstDataRendered() {
    this.gridLoaded = true;

    // Resize columns to fit screen
    this.gridOptions.api.sizeColumnsToFit();
  }

  /** When the grid is resized, NEED DEBOUNCE */
  public gridSizeChanged() {
    // console.log('Grid Resized')
  }

  /** Filter global option */
  public gridFilterGlobal() {
    this.grid.api.setQuickFilter(this.filterGlobalTerm);
  }

  /**
   * Get selected rows out of the datagrid
   * @param event
   */
  public gridSelectionChanged() {
    const selectedRows = this.grid.api.getSelectedNodes().map(node => node.data);
    console.log(selectedRows);
  }

  /**
   * On grid state changes such as sorting, filtering and grouping
   * Need to debounce resizing
   * @param $event
   */
  public gridStateChanged() {
    // console.log('gridStateChanged', $event.type);
    this.gridState = {
      columns: this.gridColumnApi.getColumnState(),
      groups: this.gridColumnApi.getColumnGroupState(),
      sorts: this.grid.api.getSortModel(),
      filters: this.grid.api.getFilterModel(),
    };

    // Only save state after grid has been fully loaded
    if (this.gridLoaded) {
      // Pass gridstate to status component
      this.gridStatusComponent.gridStateChange(this.gridState);
      this.gridStateSave();
    }
  }

  /** When data in the grid changes */
  public gridRowDataChanged() {
    // Whenever data is loaded into the grid the filters are wiped out. Check if filters are present and reload them
    if (this.gridState.filters) {
      this.grid.api.setFilterModel(this.gridState.filters);
      this.grid.api.onFilterChanged();
    }
  }

  /** Save the grid state */
  public gridStateSave() {
    window.localStorage.gridState = JSON.stringify(this.gridState);
  }

  /** Restore the grid state */
  public gridStateRestore() {
    const state = window.localStorage.gridState;
    if (state) {
      this.gridState = JSON.parse(state);
      this.gridColumnApi.setColumnState(this.gridState.columns);
      this.gridColumnApi.setColumnGroupState(this.gridState.groups);
      this.grid.api.setSortModel(this.gridState.sorts);
      this.grid.api.setFilterModel(this.gridState.filters);
      this.grid.api.onFilterChanged();
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

  /**
   * Refresh users
   */
  public usersRefresh() {
    this.api.users.get(true).subscribe();
  }

  /** Toggle the sidebar */
  public sidebarToggle(toggle: boolean) {
    this.ui.sidebarToggle(!toggle);
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

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    } // Unsub
  }
}
