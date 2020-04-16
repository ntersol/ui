import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { GridColumnHeaderDirective } from './cell-header.directive';
import { GridColumnCellDirective } from './cell-body.directive';

@Directive({ selector: 'grid-column' })
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
}
