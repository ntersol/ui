import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsTableExpansionTemplate]' })
export class TableRowExpansionDirective {
  constructor(public template: TemplateRef<any>) { }
}
