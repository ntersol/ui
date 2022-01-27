import { Component, ElementRef, ViewChild } from '@angular/core';
import { NtsTable, TableComponent } from '@ntersol/table';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-table-showcase',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
// Named this ShowcaseTableComponent instead of TableComponent so that @ViewChild type wouldn't collide
export class ShowcaseTableComponent {
  @ViewChild('expandExample', { static: false }) ntsExpandTable!: TableComponent;
  @ViewChild('basicTmpl', { static: false }) basicTmpl!: ElementRef;

  public basicTS: string = `
  public rows: any[] | null = [] = [
    { name: 'Bob', skill: 'cooking burgers', favoritePhrase: 'omg.' },
    { name: 'Linda', skill: 'singing', favoritePhrase: 'Ow! My face!' },
    { name: 'Gene', skill: 'fart piano', favoritePhrase: '??' },
    { name: 'Tina', skill: 'saying uhhhhhhhh', favoritePhrase: 'uhhhhhhh' },
    { name: 'Louise', skill: 'guilty conscience', favoritePhrase: 'No' },
  ];

  public columns: NtsTable.Column[] = [
    { header: 'Name', field: 'name' },
    { header: 'Skill', field: 'skill', sortable: false }
  ];

  public headerText?: string | null = 'Bob\'s Burgers Characters';
  `;

  public otherTS: string = `
  // Show or hide the table header
  public showHeader = true;

  // Enable filter search box on table header
  public showFilter = false;

  // Pre-filter the table data client-side
  // Note: Will filter even if showFilter is false
  // TODO: If filter enabled, bind the filterTerm to the filter field
  public filterTerm: string | null = null;

  // Enable pagination and dictate how many rows per page
  public paginateRows = 0;
  public rowsPerPageOptions: number[] = [];

  // Improve table performance by leveraging a function to uniquely track rows by
  // This is akin to Angular's trackBy when using ngFor
  public rowTrackBy: any = null;

  // Render rows a little more compact in size
  public compact = false;

  // Identifiable dataKey for targeting row expansion
  public dataKey: any = null;
  `;

  public exampleHTML: string = this.htmlEncode(`
  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText"></nts-table>
  `);

  public basicHTML: string = this.htmlEncode(`
  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText"></nts-table>
  `);

  public filterHTML: string = this.htmlEncode(`
  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText"
    [showFilter]="showFilter">
  </nts-table>
  `);

  public compactHTML: string = this.htmlEncode(`
  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText + ' - Compact'"
    [compact]="compact">
  </nts-table>

  <!-- OR -->

  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText + ' - Compact'"
    [compact]="true">
  </nts-table>
  `);

  public paginationHTML: string = this.htmlEncode(`
  <nts-table [rows]="rows" [columns]="columns" [headerText]="headerText"
    [paginateRows]="paginateRows"
    [rowsPerPageOptions]="rowsPerPageOptions">
  </nts-table>
  `);

  public rowExpansionHTML: string = this.htmlEncode(`
  <nts-table #expandExample [rows]="rows" [columns]="columns" [headerText]="headerText" dataKey="name">
    <table-column field="expansion">
      <ng-template table-expansion-template let-column="column" let-row="row">
        <div>
          Favorite Phrase: {{row.favoritePhrase}}
        </div>
      </ng-template>
    </table-column>
  </nts-table>`);

  public customColumnHTML: string = this.htmlEncode(`
  <nts-table #expandExample [rows]="rows" [columns]="columns" [headerText]="headerText" dataKey="name">
    <table-column field="name">
      <ng-template table-cell-template let-value="value" let-column="column" let-row="row">
        <div>
          <b>Name: </b>{{value}}
        </div>
      </ng-template>
    </table-column>
  </nts-table>`);

  public filterTS: string = `
  // Enable filter search box on table header
  public showFilter = true;

  // Pre-filter the table data client-side
  // Note: Will filter even if showFilter is false
  // TODO: If filter enabled, bind the filterTerm to the filter field
  public filterTerm: string | null = null;
  `;

  public paginationTS: string = `
  // Enable pagination and dictate how many rows per page
  public paginateRows = 2;
  public rowsPerPageOptions: number[] = [1,2,3];
  `;

  public compactTS: string = `
  public compact = true;
  `;

  public dataKeyTS: string = `
  public dataKey: = 'name';

  ngAfterViewInit() {
    // Had to add this to get row expansion to show for some reason? Another CD cycle? OnPush culprit?
    this.ntsExpandTable.ngOnChanges({});
    // Added this to slightly reduce the size of the expansion column
    this.ntsExpandTable.table.autoLayout = true;
  }
  `;

  public rows: any[] | null = ([] = [
    { name: 'Bob', skill: 'cooking burgers', favoritePhrase: 'omg.' },
    { name: 'Linda', skill: 'singing', favoritePhrase: 'Ow! My face!' },
    { name: 'Gene', skill: 'keyboard', favoritePhrase: '??' },
    { name: 'Tina', skill: 'running without moving arms', favoritePhrase: 'uhhhhhhh' },
    { name: 'Louise', skill: 'guilty conscience', favoritePhrase: 'No' },
  ]);

  public columns: NtsTable.Column[] = [
    { header: 'Name', field: 'name' },
    { header: 'Skill', field: 'skill', sortable: false },
  ];

  public headerText?: string | null = "Bob's Burgers Characters";

  public showFilter = true;

  public paginateRows = 2;
  public rowsPerPageOptions = [1, 2, 3];

  constructor(private highlight: HighlightService) {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
    // TODO: Had to add this to get row expansion to show for some reason? Another CD cycle?
    this.ntsExpandTable.ngOnChanges({});
    // Added this to slightly reduce the size of the expansion column
    this.ntsExpandTable.table.autoLayout = true;
  }

  // TODO: Move this somewhere shared...maybe?
  htmlEncode(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
