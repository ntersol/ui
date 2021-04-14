import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[table-expansion-template]' })
export class TableRowExpansionDirective {
  constructor(public template: TemplateRef<any>) {}
}
