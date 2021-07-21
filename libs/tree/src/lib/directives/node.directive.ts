import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ntsTreeTemplateNode]' })
export class TreeTemplateNodeDirective {
  constructor(public template: TemplateRef<any>) {}
}
