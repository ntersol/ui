import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Table } from 'primeng/table';
import { TableColumnDirective } from '../../directives/column.directive';
import { NtsTable } from '../../table';

@Component({
  selector: 'nts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  /** Rows */
  @Input() rows: any[] | undefined;
  /** Columns */
  @Input() columns: NtsTable.Column[] | undefined;
  /** Custom header text */
  @Input() headerText: string | undefined;
  /** Show the custom filter box */
  @Input() showFilter = false;
  /** Show table headers */
  @Input() showHeader = true;
  /** Custom global filter term */
  @Input() filterTerm: string | null = null;
  /** Enable paginate and only display this many entries */
  @Input() paginateRows: number | undefined;
  /** Shows a dropdown with how many results per page */
  @Input() rowsPerPageOptions: number[] | undefined;

  @Input() rowTrackBy?: Function;

  @Input() compact = false;

  /** Required input for ngPrime expander - expands all rows with the same key */
  @Input() dataKey?: string | null;

  public shouldShowExpandRow = false;

  public columnWidthsPercent: number[] | null = null;

  /** Holds custom DOM templates passed from parent */
  public templates: Record<string, TableColumnDirective> = {};
  @ContentChildren(TableColumnDirective)
  set columnTemplates(val: QueryList<TableColumnDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      arr.forEach(template => (this.templates[template.field] = template));
    }
  }
  /** Reference to the p-table instance */
  @ViewChild('tt', { static: true }) table!: Table;
  /** Hold an unsorted instance of the rows */
  private rowsSrc: any[] | undefined;
  /** Keep an instance of the last sorted option. Used to unset sort */
  private sortLast: { field?: string; order?: number } = {};

  @ViewChildren('th') tableHeaders!: QueryList<ElementRef>;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.rows) {
      this.rowsSrc = [...this.rows];
    }

    this.updateShouldShowExpandRow();
  }

  ngOnChanges(model: SimpleChanges) {
    // When filter term changes
    if (model.filterTerm) {
      this.table.filterGlobal(this.filterTerm, 'contains');
    }
    // When row data changes
    if (model.rows && this.rows) {
      this.rowsSrc = [...this.rows];
    }

    if (this.tableHeaders) {
      setTimeout(() => {
        this.columnWidthsPercent = this.columnWidthFix(this.tableHeaders.toArray());
        this.ref.markForCheck();
      });
    }

    this.updateShouldShowExpandRow();
  }

  /**
   * Reset/remove the sort order after user toggles through each state
   * @param sort
   */
  public onSort(sort: { field: string; order: number }) {
    if (this.sortLast.field === sort.field && sort.order === 1 && this.rowsSrc) {
      this.table.sortOrder = 0;
      this.table.sortField = '';
      this.rows = [...this.rowsSrc];
      this.sortLast = {};
    } else {
      this.sortLast = { ...sort };
    }
  }

  /**
   * Create an array of column width percentages
   *
   * @param th
   */
  private columnWidthFix(th: ElementRef<any>[]) {
    if (!th || !th.length) {
      return null;
    }
    const widthsPx = th.map(x => x.nativeElement.clientWidth);
    const tableWidth = widthsPx.reduce((a, b) => a + b);
    if (!tableWidth) {
      return null;
    }
    return widthsPx.map(x => Math.floor((x / tableWidth) * 100));
  }

  private updateShouldShowExpandRow() {
    this.shouldShowExpandRow = !!this.templates['expansion'] && !!this.templates['expansion'].templateExpansion && !!this.dataKey;
  }

  ngOnDestroy() {}
}
