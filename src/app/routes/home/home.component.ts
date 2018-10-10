import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, TemplateRef, AfterViewInit  } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { Models } from '$models';
// import { DesktopUtils } from '$utils';
import { columns } from './columns';
import { ContextService, ContextMenuList } from '$libs';

import { TemplateRendererComponent } from '../../libs/grid/template-renderer/template-renderer.component';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('grid') grid: AgGridNg2;
  public gridColumnApi: any;

  public cellTemplates = {
   //phone:null
  }

  @ViewChild('phone') cellTemplatePhone: TemplateRef<any>;

  public users$ = this.api.select.users$;
  public sidebarOpen$ = this.ui.select.sidebarOpen$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

  public gridOptions: GridOptions = {
   
  }

  public filterGlobalTerm = '';
  
  public columns = columns;
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
    const columns = this.columns.map(column => {
      if (column.field === 'phone') {
        column.cellRendererFramework = TemplateRendererComponent;
        column.cellRendererParams = {
           ngTemplate: this.cellTemplatePhone // This breaks grouping
        }
      }
      return column;
    })
    this.gridOptions.api.setColumnDefs(columns);
   
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
      //this.datagrid.viewCreate();
      //this.ref.detectChanges();
    });
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
   * When the grid is ready
   * @param params
   */
  public onGridReady(params: any) {
    console.log(params)
    // Resize columns to fit screen
    this.gridOptions.api.sizeColumnsToFit();
    this.gridColumnApi = params.columnApi;

    // const allColumnIds:any[] = [];
    // params.columnApi.getAllColumns().forEach((column: any) => allColumnIds.push(column.colId));
    // params.columnApi.autoSizeColumns(allColumnIds);
  }

  /** Filter global option */
  public onFilterGlobal() {
    this.grid.api.setQuickFilter(this.filterGlobalTerm);
  }

  /**
   * Get selected rows out of the datagrid
   * @param event
   */
  public onSelectionChanged() {
    const selectedData = this.grid.api.getSelectedNodes().map(node => node.data);
    
    console.log(selectedData);
    this.gridSaveState();
  }


  public gridSaveState() {
    console.log(this.gridColumnApi);
    console.log(this.gridColumnApi.getColumnState());
    console.log(this.gridColumnApi.getColumnGroupState());
    console.log(this.gridColumnApi.getSortModel());
    console.log(this.gridColumnApi.getFilterModel());
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
