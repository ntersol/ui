import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { GridColumnHeaderDirective } from './cell-header.directive';
import { GridColumnCellDirective } from './cell-body.directive';
import { GridRowExpansionDirective } from './row-expansion.directive';

@Directive({ selector: '[ntsGridColumn]' })
export class GridColumnDirective {
  @Input() name!: string;
  @Input() field!: string;

  // Add custom props here for overrides in the cell templates
  // Cell Templates
  @ContentChild(GridColumnCellDirective, { read: TemplateRef, static: true })
  templateCell!: TemplateRef<any>;
  // Header Templates
  @ContentChild(GridColumnHeaderDirective, { read: TemplateRef, static: true })
  templateHeader!: TemplateRef<any>;
  // Expansion Template
  @ContentChild(GridRowExpansionDirective, { read: TemplateRef, static: false })
  templateExpansion!: TemplateRef<any>;
}
