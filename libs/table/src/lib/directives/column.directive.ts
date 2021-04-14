import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { TableColumnHeaderDirective } from './cell-header.directive';
import { TableColumnCellDirective } from './cell-body.directive';
import { TableRowExpansionDirective } from './row-expansion.directive';

@Directive({ selector: 'table-column' })
export class TableColumnDirective {
  @Input() name!: string;
  @Input() field!: string;
  // Add custom props here for overrides in the cell templates

  // Cell Templates
  @ContentChild(TableColumnCellDirective, { read: TemplateRef, static: false })
  templateCell!: TemplateRef<any>;

  // Header Templates
  @ContentChild(TableColumnHeaderDirective, {
    read: TemplateRef,
    static: false,
  })
  templateHeader!: TemplateRef<any>;

  // Expansion Template
  @ContentChild(TableRowExpansionDirective, {
    read: TemplateRef,
    static: false,
  })
  templateExpansion!: TemplateRef<any>;
}
