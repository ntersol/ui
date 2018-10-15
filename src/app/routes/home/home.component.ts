import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions, ColumnApi } from 'ag-grid-community';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { debounce } from 'helpful-decorators';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { GridStatusBarComponent, GridTemplateRendererComponent } from '$libs';
import { Models } from '$models';
import { columns } from './columns';


declare interface GridState {
  columns?: any;
  sorts?: any;
  filters?: any;
}

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('grid') grid: AgGridNg2;
  @ViewChild('gridContainer') gridContainer: ElementRef;

  public gridColumnApi: ColumnApi;
  public gridOptions: GridOptions = {
    // A default column definition with properties that get applied to every column
    defaultColDef: {
      width: 150, // Set every column width
      editable: false, // Make every column editable
      enableRowGroup: true, // Make every column groupable
      filter: 'agTextColumnFilter', // Make every column use 'text' filter by default
    },
    statusBar: {
      statusPanels: [{ statusPanel: 'statusBarComponent', align: 'left' }],
    },
  };
  public gridState: GridState = {};
  public gridComponents = { statusBarComponent: GridStatusBarComponent };
  public gridLoaded = false;
  public gridFilterTerm = '';
  public gridRowsSelected: Models.User[];
  /** Allow the grid to update state. Disable to prevent infinite loops IE during column resizing */
  public gridAllowUpdate = true;

  @ViewChild('phone') cellTemplatePhone: TemplateRef<any>;

  public users$ = this.api.select.users$;
  public sidebarOpen$ = this.ui.select.sidebarOpen$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

  public columns = columns;

  private gridStatusComponent: GridStatusBarComponent;
  
  

  constructor(
    private api: ApiService,
    public ui: UIStoreService,
    private fb: FormBuilder,
  ) {}

  public ngOnInit() {
    // Get users and load into store
    this.api.users.get().subscribe();

    // On window resize event, fit the grid columns to the screen
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        if (this.gridLoaded && this.gridOptions.api) {
          this.gridFit();
        }
      });

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
    // Attach custom cell templates to the appropriate column
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
    this.gridFit();
  }

  /** Have the columns fill the available space if less than grid width */
  @debounce(300, {
    leading: false,
    trailing: true,
  })
  public gridFit() {
    const widthCurrent = this.gridColumnApi.getColumnState().reduce((a, b) => a + b.width, 0);
    const widthGrid = this.gridContainer.nativeElement.offsetWidth;
    if (widthCurrent < widthGrid && this.gridAllowUpdate && this.gridLoaded) {
      // Disable allow update to prevent loop
      this.gridAllowUpdate = false;
      // Resize columns to fit screen
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  /** When the grid is resized, NEED DEBOUNCE */
  public gridSizeChanged() {
    // console.log('Grid Resized')
  }

  /** Filter global option */
  public gridFilterGlobal() {
    this.grid.api.setQuickFilter(this.gridFilterTerm);
  }

  /**
   * Get selected rows out of the datagrid
   * @param event
   */
  public gridSelectionChanged() {
    this.gridRowsSelected = this.grid.api.getSelectedNodes().map(node => node.data);
  }

  /**
   * On grid state changes such as sorting, filtering and grouping
   * Added debounce since some events fire quickly like resizing
   * @param $event
   */
  @debounce(300, {
    leading: false,
    trailing: true,
  })
  public gridStateChanged($event: any) {
    // console.log('gridStateChanged', $event.type, this.gridAllowUpdate);
    if (this.gridAllowUpdate) {
      this.gridState = {
        columns: this.gridColumnApi.getColumnState(),
        sorts: this.grid.api.getSortModel(),
        filters: this.grid.api.getFilterModel(),
      };

      if ($event.type === 'columnResized') {
        this.gridFit();
      }

      // Only save state after grid has been fully loaded
      if (this.gridLoaded) {
        // Pass gridstate to status component
        this.gridStatusComponent.gridStateChange(this.gridState);
        this.gridStateSave();
      }
    }
    this.gridAllowUpdate = true;
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
      this.grid.api.setSortModel(this.gridState.sorts);
      this.grid.api.setFilterModel(this.gridState.filters);
      this.grid.api.onFilterChanged();
    }
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

  // Must be present even if not used for unsubs
  ngOnDestroy() {}
}
