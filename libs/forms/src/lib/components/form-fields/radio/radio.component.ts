import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Forms } from '../../../forms.model';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RadioComponent extends BaseFormFieldComponent<any[]> implements OnInit {
  @Input() options?: Forms.FieldOptions[] | null = null;
  @Input() dataKey?: string | null = null;
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
