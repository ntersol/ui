import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  OnChanges,
  OnDestroy,
  HostListener,
  SimpleChanges,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColumnApi, ColDef, GridApi, RowNode } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { debounce } from 'helpful-decorators';
import { GridStatusBarComponent } from '../grid-status-bar/grid-status-bar.component';
import { GridColumnDirective } from '../../directives/column.directive';
import { columnsTemplateAttach } from '../../utils/attachColumnTemplates.util';
import { rowsReselect } from '../../utils/reselectRows.util';
import { NtsGridState } from '../../grid';
const defaultsDeep = require('lodash/defaultsDeep');
const cloneDeep = require('lodash/cloneDeep');
/**
 * A powerful data grid for visualizing and managing complex information
 */
@Component({
  selector: 'nts-grid',
  templateUrl: './grid.component.html',
  styleUrls: [
    // After moving starter OUT of monorepo, update path to node_modules
    '../../../../../../../node_modules/ag-grid-community/dist/styles/ag-grid.css',
    '../../../../../../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css',
    './grid.component.scss',
  ],
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('grid') grid!: AgGridAngular;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  /** The property containing the unique ID of the row data */
  @Input() rowUniqueId!: string;
  @Input() parentRef: any;
  @Input() license: string | undefined;
  @Input() enableSorting = true;
  @Input() enableFilter = true;
  @Input() enableColResize = true;
  /** Hold and set default options for grid*/
  private _gridOptions: GridOptions = {
    context: {
      this: this.parentRef,
    },
    // A default column definition with properties that get applied to every column
    defaultColDef: {
      width: 150, // Set every column width
      editable: false, // Make every column editable
      sortable: this.enableSorting,
      resizable: this.enableColResize,
      enableRowGroup: true, // Make every column groupable
      filter: this.enableFilter ? 'agSetColumnFilter' : false, // Make every column use 'text' filter by default
      filterParams: {
        syncValuesLikeExcel: true,
      },
      menuTabs: ['generalMenuTab', 'filterMenuTab'], // , 'columnsMenuTab'
      // set the cell renderer to 'group'
      // cellRenderer: 'agGroupCellRenderer',
    },
    getRowNodeId: data => data[this.rowUniqueId],
    statusBar: {
      statusPanels: [
        {
          statusPanel: 'statusBarComponent',
          align: 'left',
          key: 'statusBarComponent',
        },
      ],
    },
  };
  @Input()
  set gridOptions(options: GridOptions) {
    // options.groupRowRenderer:  'agGroupCellRenderer';
    this._gridOptions = defaultsDeep(this._gridOptions, options);
  }
  get gridOptions() {
    return this._gridOptions;
  }
  // Global filter term
  @Input() gridFilterTerm: string | null = null;
  public gridFilterTerm$ = new BehaviorSubject<string | null>(this.gridFilterTerm);
  @Input() gridState: NtsGridState = {
    groupsColumns: [],
    groupsRows: {},
    columnDefs: [],
    columnsState: [],
    sorts: [],
    filters: {},
  };
  @Input() rowData: any[] | undefined;
  @Input() getMainMenuItems: any;
  @Input() columnDefs: ColDef[] | undefined;
  @Input() animateRows: boolean | undefined;
  @Input() enableRangeSelection: boolean | undefined;
  @Input() rememberGroupStateWhenNewData: any;
  @Input() groupUseEntireRow: boolean | undefined;
  @Input() groupRemoveSingleChildren = false;
  @Input() getContextMenuItems: any;
  @Input() frameworkComponents: any;
  @Input() rowGroupPanelShow: any;
  /** Allow the user to select more than one row */
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  /** When new entries are passed in, should rows that are currently selected stay selected */
  @Input() rowsStaySelected = true;
  /**
   * Highlight and scroll to existing row or rows. This requires the uniqueId to match
   */
  @Input() set selectRows(rowsSrc: any | any[]) {
    if (!this.gridApi || !rowsSrc || !this.rowUniqueId) {
      return;
    }
    // Create an array of uniqueIds, this will be used to match against the existing rows
    const uniqueIds: string[] = [];
    if (Array.isArray(rowsSrc) && rowsSrc.length) {
      rowsSrc.forEach(row => uniqueIds.push(row[this.rowUniqueId]));
    } else {
      uniqueIds.push(rowsSrc[this.rowUniqueId]);
    }
    // Deselect all rows first
    this.gridApi.deselectAll();
    this.gridApi.forEachNode((node, i) => {
      if (uniqueIds.includes(node.data[this.rowUniqueId])) {
        node.setSelected(true, false);
      }
      // Scroll to the first node supplied by the input
      if (i === 0 && this.gridApi) {
        this.gridApi.ensureNodeVisible(node);
      }
    });
  }
  /**
   * Update individual rows without refreshing the entire grid
   */
  @Input() set updateRows(rowsSrc: any | any[]) {
    if (!this.gridApi || !rowsSrc || !this.rowUniqueId) {
      return;
    }
    this.gridApi.updateRowData({ update: [...rowsSrc] });
    this.gridApi.redrawRows();
  }
  @Output() stateChange = new EventEmitter<NtsGridState>();
  @Output() rowsSelected = new EventEmitter<any[]>();
  @Output() selectedRowDataDisplayed = new EventEmitter<any[]>();
  /** called when grid data is ready and rendered */
  @Output() gridIsReady = new EventEmitter<any[]>();
  // public rows: any[] = [];
  public gridApi: GridApi | undefined;
  public gridColumnApi: ColumnApi | undefined;
  public gridLoaded: boolean | undefined;
  public gridAllowUpdate = false;
  public gridComponents = { statusBarComponent: GridStatusBarComponent };
  public gridStatusComponent: GridStatusBarComponent | undefined;
  /** Watch all grid state changes */
  public gridEvent$ = new Subject<'sortChanged' | 'filterChanged' | 'columnRowGroupChanged' | 'columnPinned' | 'columnMoved' | 'columnResized'>();
  /** Hold latest gridstate */
  public gridState$ = new BehaviorSubject<any>(this.gridState);
  public columns$ = new BehaviorSubject<ColDef[] | null>(null);
  /** Get the currently visible rows accounting for grouping, filtering & sorting */
  public get rowsVisible() {
    return this.gridApi
      ? this.gridApi
          .getRenderedNodes()
          .map(x => x.data)
          .filter(x => x)
      : [];
  }
  /** Get the currently selected rows that are visible  */
  public get rowsVisibleSelected() {
    return this.gridApi
      ? this.gridApi
          .getRenderedNodes()
          .filter(x => x.isSelected())
          .map(x => x.data)
          .filter(x => x)
      : [];
  }
  /** Dictionary of keys being pressed */
  private keysPressed: { [key: string]: boolean } = {};
  /** Was the event a right click */
  private isRightClick = false;
  /** Preserve a list of rows that are currently selected. Used in conjunction with rowsStaySelected to keep rows highlighted*/
  private rowsSelectedList: any[] | undefined;
  /** Holds custom DOM templates passed from parent */
  private _columnTemplates: any;
  @ContentChildren(GridColumnDirective)
  set columnTemplates(val: QueryList<GridColumnDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      this._columnTemplates = arr;
    }
  }
  get columnTemplates(): QueryList<GridColumnDirective> {
    return this._columnTemplates;
  }
  private subsActive = true;
  // Manage keyboard events
  @HostListener('document:keydown', ['$event']) keyPressed = (event: KeyboardEvent) => this.keyboardEvent(event);
  @HostListener('document:keyup', ['$event']) keyUp = (event: KeyboardEvent) => this.keyboardEvent(event);

  constructor() {}

  ngOnInit() {
    // Set license
    if (this.license) {
      LicenseManager.setLicenseKey(this.license);
    }
    // Load column definitions from gridState first if present, if not fall back to columnDefs
    if (this.gridState && this.gridState.columnDefs.length) {
      const cols = columnsTemplateAttach(this.gridState.columnDefs, this.columnTemplates);
      cols.forEach(col => (col.colId = col.field)); // AG-grid needs the colID to match when doing a setColumnDefs call
      this.columns$.next(cols);
    } else if (this.columnDefs) {
      this.columnDefs.forEach(col => (col.colId = col.field)); // AG-grid needs the colID to match when doing a setColumnDefs call
      this.columns$.next(columnsTemplateAttach(this.columnDefs, this.columnTemplates));
    }
    // When state changes
    this.gridEvent$
      .pipe(
        debounceTime(100),
        filter(() => this.gridAllowUpdate),
        takeWhile(() => this.subsActive),
      )
      .subscribe(() => {
        this.gridState$.next(this.gridStateGet());
      });
    // When grid state changes
    this.gridState$
      .pipe(
        takeWhile(() => this.subsActive),
        filter(() => this.gridAllowUpdate),
      )
      .subscribe(gridState => {
        // Update grid status component
        if (this.gridStatusComponent) {
          this.gridStatusComponent.gridStateChange(gridState);
        }
        // Emit new gridstate to parent
        this.stateChange.emit(gridState);
      });
    this.gridFilterTerm$
      .pipe(
        debounceTime(100),
        filter(() => (this.grid && this.grid.api ? true : false)),
        takeWhile(() => this.subsActive),
      )
      .subscribe(term => {
        this.grid.api.setQuickFilter(term);
        this.grid.api.deselectAll();
      });
    // On window resize event, fit the grid columns to the screen
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        takeWhile(() => this.subsActive),
      )
      .subscribe(() => this.gridFit());
  }

  ngOnChanges(model: SimpleChanges) {
    // If rowdata changes, reselect rows
    if (model.rowData && this.rowsStaySelected && this.rowUniqueId && this.rowsSelectedList && this.gridApi) {
      rowsReselect(this.rowUniqueId, this.rowsSelectedList, this.gridApi);
    }
    // When grid state changes
    if (this.gridLoaded && model.gridState) {
      this.gridStateSet(this.gridState);
    }
    // When the global filter changes
    if (this.gridLoaded && model.gridFilterTerm) {
      this.gridFilterTerm$.next(this.gridFilterTerm);
    }
    // Make sure primary key is present in row data
    if (this.rowData && this.rowData.length && !this.rowData[0][this.rowUniqueId]) {
      console.error('rowUniqueId not found in row model, please update the unique ID');
    }
  }

  /**
   * When the grid is ready and has finished loading
   * @param params
   */
  public gridReady(params: any) {
    this.gridColumnApi = params.columnApi;
    this.gridApi = this.grid.api;
    // Set reference to status component so state can be pushed
    this.gridStatusComponent = (<any>this).gridOptions.api.getStatusPanel('statusBarComponent').getFrameworkComponentInstance();
    if (this.gridStatusComponent) {
      // Attach reset method to status component so the status method
      this.gridStatusComponent.reset = this.gridReset.bind(this);
    }
    this.gridStateSet(this.gridState);
    // Check if a global filter term is present, refilter
    if (this.gridFilterTerm) {
      this.gridFilterTerm$.next(this.gridFilterTerm);
    }
    this.gridLoaded = true;
    this.gridAllowUpdate = true;
    this.gridIsReady.emit();
  }

  /** After the grid has loaded data */
  public gridFirstDataRendered() {
    this.gridStateSet(this.gridState);
    setTimeout(() => this.gridFit(), 100);
  }

  /** Have the columns fill the available space if less than grid width */
  public gridFit() {
    if (this.gridColumnApi && this.gridContainer && this.gridContainer.nativeElement) {
      const widthCurrent = this.gridColumnApi.getColumnState().reduce((a, b) => a + <any>b.width, 0);
      const widthGrid = this.gridContainer.nativeElement.offsetWidth;
      if (widthCurrent < widthGrid && this.gridAllowUpdate && this.gridLoaded) {
        // Disable allow update to prevent loop
        this.gridAllowUpdate = false;
        // Resize columns to fit screen
        this.grid.api.sizeColumnsToFit();
        setTimeout(() => (this.gridAllowUpdate = true), 500);
      }
    }
  }

  /**
   * Get selected rows out of the datagrid and emit to parent
   * @param event
   */
  @debounce(200)
  public gridSelectionChanged() {
    this.rowsSelectedList = this.rowsVisibleSelected;
    this.rowsSelected.emit(this.rowsVisibleSelected);
  }

  /**
   * On right click
   */
  public cellContextMenu(e: any) {
    this.isRightClick = true;
    // Deselect all previous rows if control is not pressed OR the current node is not selected
    if (!this.keysPressed.Control && !e.node.selected) {
      this.grid.api.deselectAll();
    }
    this.grid.api.clearRangeSelection();
    e.node.setSelected(true); // Select current row
    this.gridSelectionChanged(); // Set as lead
  }

  /**
   * When a range selection (via drag select) is finished on the data grid
   * TODO: Add config to allow selecting rows vs selecting cells
   * @param e
   */
  @debounce(200)
  public gridRangeSelectionChanged(e: any) {
    // Wait till the drag is finished
    // Ignore right click events
    if (e && !this.isRightClick) {
      // e.finished isn't currently working
      // Get the grid range selection
      const selections = this.grid.api.getCellRanges();
      if (selections && selections.length) {
        const nodesList: RowNode[] = [];
        // Loop through selections
        selections.forEach(selection => {
          if (selection.startRow && selection.endRow) {
            // Determine if this is a top to bottom or bottom to top drag, set appropriate index for FOR loop below
            const start = selection.startRow.rowIndex < selection.endRow.rowIndex ? selection.startRow.rowIndex : selection.endRow.rowIndex;
            const end = selection.startRow.rowIndex > selection.endRow.rowIndex ? selection.startRow.rowIndex : selection.endRow.rowIndex;
            // Loop through all nodes, if it's index falls between start and end, add it to nodes list
            this.grid.api.forEachNode((node: any) => {
              if (node.rowIndex >= start && node.rowIndex <= end) {
                nodesList.push(node);
              }
            });
          }
        });
        // Deselect all previous rows if shift or control is not pressed
        if (!this.keysPressed.Shift && !this.keysPressed.Control) {
          this.grid.api.deselectAll();
        }
        // Set all selected nodes to true
        nodesList.forEach(node => node.setSelected(true));
        // Clear range section, add back when e.finished is working
        // this.grid.api.clearRangeSelection();
        // Get the node that the drag started on
        // const startNode = this.grid.api.getDisplayedRowAtIndex(selection[0].start.rowIndex);
      }
      // TODO: Emit selected columns not just rows
    }
    this.isRightClick = false;
  }

  /**
   * Reset the grid state
   */
  public gridReset() {
    this.gridAllowUpdate = false;
    this.grid.api.setSortModel(null);
    Object.keys(this.gridState.filters).forEach(key => {
      const instance = this.grid.api.getFilterInstance(key);
      instance.setModel(null);
    });
    this.grid.api.setFilterModel(null);
    if (this.gridColumnApi) {
      this.gridColumnApi.resetColumnState();
    }
    // Get latest grid state
    const gridState = this.gridStateGet();
    // Update status component
    if (this.gridStatusComponent && gridState) {
      this.gridStatusComponent.gridStateChange(gridState);
    }
    this.gridState$.next(gridState);
    this.gridAllowUpdate = true;
    this.gridFit();
  }

  /**
   * Get the current state of the grid
   */
  public gridStateGet() {
    if (!this.gridColumnApi) {
      return;
    }
    // Create a record of which rowgroups are open
    const groupsRows: Record<string, boolean> = {};
    this.grid.api.forEachNode(node => {
      if (node.expanded) {
        groupsRows[node.key] = true;
      }
    });
    // Create grid state
    return <NtsGridState>{
      columnDefs: this.gridColumnApi.getAllGridColumns().map(col => {
        const colSrc = col.getUserProvidedColDef(); // Extract source column info
        delete colSrc.cellRendererFramework; // Remove custom templates which cause an error when converting to JSON
        delete colSrc.cellRendererParams;
        return colSrc;
      }),
      columnsState: this.gridColumnApi.getColumnState(),
      groupsColumns: this.grid.columnApi.getColumnGroupState(),
      groupsRows: groupsRows,
      sorts: this.grid.api.getSortModel(),
      filters: this.grid.api.getFilterModel(),
    };
  }

  /**
   * Restore the grid state
   */
  public gridStateSet(gridStateSrc: NtsGridState) {
    // Avoid AG grid mutation madness
    const gridState: NtsGridState = cloneDeep(gridStateSrc);
    if (this.grid && this.gridColumnApi && gridState) {
      this.gridAllowUpdate = false;
      // Reload columns
      if (gridState.columnDefs && gridState.columnDefs.length) {
        const columns = columnsTemplateAttach(gridState.columnDefs, this.columnTemplates);
        columns.forEach(col => (col.colId = col.field)); // AG-grid needs the colID to match when doing a setColumnDefs call
        this.grid.api.setColumnDefs([]); // Clear out any columns in the grid before entering new ones, avoids random column bug
        this.grid.api.setColumnDefs(columns);
      }
      // Reload column STATE, different than column definitions
      if (gridState.columnsState && gridState.columnsState.length) {
        this.gridColumnApi.setColumnState(gridState.columnsState);
      }
      // Reload sorting
      if (gridState.sorts) {
        this.grid.api.setSortModel(gridState.sorts);
      }
      // Reload filtering
      if (gridState.filters) {
        Object.keys(gridState.filters).forEach(key => {
          const instance = this.grid.api.getFilterInstance(key);
          instance.setModel(gridState.filters[key]);
        });
        this.grid.api.setFilterModel(gridState.filters);
        this.grid.api.onFilterChanged();
      }
      // Reload row groups (open/close)
      if (gridState.groupsRows && Object.keys(gridState.groupsRows).length) {
        this.grid.api.forEachNode(node => {
          if (gridState.groupsRows[node.key]) {
            node.setExpanded(true);
          }
        });
      }
      // Update status component
      if (this.gridStatusComponent) {
        this.gridStatusComponent.gridStateChange(gridState);
      }
      setTimeout(() => {
        this.gridAllowUpdate = true;
      }, 100);
    }
  }

  /** When data in the grid changes */
  public gridRowDataChanged() {
    // Whenever data is loaded into the grid the filters are wiped out. Check if filters are present and reload them
    if (this.gridLoaded && this.gridState && this.gridState.filters) {
      Object.keys(this.gridState.filters).forEach(key => {
        const instance = this.grid.api.getFilterInstance(key);
        instance.setModel(this.gridState.filters[key]);
      });
      // this.grid.api.setFilterModel(this.gridState.filters);
      this.grid.api.onFilterChanged();
    }
  }

  /**
   * Manage keypresses
   * @param event
   */
  protected keyboardEvent(event: KeyboardEvent) {
    const keysPressed = { ...this.keysPressed };
    switch (event.type) {
      case 'keydown':
        keysPressed[event.key] = true;
        break;
      case 'keyup':
        keysPressed[event.key] = false;
        break;
    }
    this.keysPressed = keysPressed;
  }
  ngOnDestroy() {
    this.subsActive = false;
  }
}
