import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NtsWizard } from '../../wizard.models';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';
import { isType } from '../../utils/typeguards.util';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nts-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnChanges {
  @Input() form?: FormGroup | null = null;
  @Input() page?: NtsWizard.PageControl | null = null;
  @Input() dataFields?: Record<string, NtsWizard.Option[]> | null = null;
  @Input() templates: Record<string, WizardFeatureDirective> = {};

  /** Used to update change detection */
  @Input() cd: number | null = null;

  @Output() buttonEvent = new EventEmitter<NtsWizard.Button>();

  public isType = isType;

  ngOnChanges(changes: SimpleChanges) {
    // If page changes
    if (changes.page) {
      // Add loop index to loop types
      // TODO: Prefer non-mutation
      this.page?.content.filter(isType.loopControl).forEach((c, i) => (c.loopIndex = i));
    }
  }
}
