import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { WizardFeatureTemplateDirective } from './feature-template.directive';

@Directive({ selector: 'feature' })
export class WizardFeatureDirective {
  @Input() name!: string;
  @Input() id!: string;
  // Add custom props here for overrides in the cell templates

  // Cell Templates
  @ContentChild(WizardFeatureTemplateDirective, { read: TemplateRef, static: false })
  template!: TemplateRef<any>;

  templateHeader!: TemplateRef<any>;
}
