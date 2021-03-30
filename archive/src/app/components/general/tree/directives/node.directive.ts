import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[tree-template-node]' })
export class TreeTemplateNodeDirective {
  constructor(public template: TemplateRef<any>) {}
}
