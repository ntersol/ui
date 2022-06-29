import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { NtsWizard } from '../../wizard.models';

@Component({
  selector: 'nts-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  @Input() section?: NtsWizard.SectionControl | null = null;
  @Input() page?: NtsWizard.PageControl | null = null;
  /** Used to update change detection */
  @Input() cd: number | null = null;
}
