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
} from '@angular/core';
import { Table } from 'primeng/table';
import { TableColumnDirective } from '../../directives/column.directive';

type NtsColumnType = 'email' | 'date' | 'dateTime' | 'currency';

export interface NtsColumn {
  field: string;
  header: string;
  type?: NtsColumnType;
  /** Arguments to pass to the formatting pipes */
  typeArgs?: string;
}
@Component({
  selector: 'nts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit, OnChanges {
  /** Rows */
  @Input() rows: any[] | undefined;
  /** Columns */
  @Input() columns: NtsColumn[] | undefined;
  /** Custom header text */
  @Input() headerText: string | undefined;
  /** Is the table sortable */
  @Input() sortable = true;
  /** Show the custom filter box */
  @Input() showFilter = false;
  /** Custom global filter term */
  @Input() filterTerm: string | null = null;

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

  constructor() {}

  ngOnInit() {
    if (this.rows) {
      this.rowsSrc = [...this.rows];
    }
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
}
