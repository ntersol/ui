import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsTableHeaderTemplate]' })
export class TableColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) { }
}
