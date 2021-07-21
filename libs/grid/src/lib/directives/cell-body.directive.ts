import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsGridCellTemplate]' })
export class GridColumnCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
