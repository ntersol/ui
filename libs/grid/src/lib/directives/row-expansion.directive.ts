import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[grid-expansion-template]' })
export class GridRowExpansionDirective {
  constructor(public template: TemplateRef<any>) {}
}
