import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[feature-template]' })
export class WizardFeatureTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
