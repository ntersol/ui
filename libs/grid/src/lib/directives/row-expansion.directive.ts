import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsGridExpansionTemplate]' })
export class GridRowExpansionDirective {
  constructor(public template: TemplateRef<any>) { }
}
