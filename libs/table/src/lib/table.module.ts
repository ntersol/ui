import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TableComponent } from './components/table/table.component';
import { TableColumnDirective } from './directives/column.directive';
import { TableColumnCellDirective } from './directives/cell-body.directive';
import { TableColumnHeaderDirective } from './directives/cell-header.directive';
import { SlugPipe } from './pipes/slug.pipe';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { TableRowExpansionDirective } from './directives/row-expansion.directive';
import { HeaderStylesPipe } from './pipes/header-styles.pipe';
const DEPS = [
  TableComponent,
  TableColumnDirective,
  TableColumnCellDirective,
  TableColumnHeaderDirective,
  TableRowExpansionDirective,
];

@NgModule({
  declarations: [DEPS, SlugPipe, PhoneNumberPipe, HeaderStylesPipe],
  imports: [CommonModule, TableModule],
  exports: [DEPS],
})
export class NtsTableModule { }
