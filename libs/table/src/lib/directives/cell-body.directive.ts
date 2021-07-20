import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsTableCellTemplate]' })
export class TableColumnCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
