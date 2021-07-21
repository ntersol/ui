import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsGridHeaderTemplate]' })
export class GridColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
