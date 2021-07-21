import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { TreeTemplateNodeDirective } from './node.directive';

@Directive({ selector: '[ntsTreeTemplate]' })
export class TreeTemplateDirective {
  @Input() name!: string;
  @Input() field!: string;
  // Add custom props here for overrides in the cell templates

  // Cell Templates
  @ContentChild(TreeTemplateNodeDirective, { read: TemplateRef, static: false })
  templateEntry!: TemplateRef<any>;

  /**
  // Header Templates
  @Input()
  @ContentChild(TableColumnHeaderDirective, {
    read: TemplateRef,
    static: false,
  })
  templateHeader!: TemplateRef<any>;
   */
}
