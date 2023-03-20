import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Forms } from '../../../forms.model';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SelectButtonComponent extends BaseFormFieldComponent<string> implements OnInit {
  @Input() options?: Forms.FieldOptions[] | null = null;
  @Input() multiple?: boolean | null = null;
  @Input() dataKey?: string | null = null;
  @Input() fullWidth = true;
  @Input() canUnselect?: boolean | null = null;

  // Store the previous value of the user selection, used to unselect
  private lastValue: string | null = '';

  constructor() {
    super();
  }

  ngOnInit(): void {}

  /**
   * When a user clicks on an option
   * @param e
   */
  public onOptionClick(e: { originalEvent: PointerEvent; index: number; option: { label: string; value: string } }) {
    // If canUnselect is set and the current value equals the previous value, reset to null to unselect
    if (this.canUnselect && !this.multiple && this.formControl?.value === this.lastValue) {
      this.formControl?.patchValue(null);
      this.formControl.markAsTouched(); // Necessary to set validation state and show errors if required
      this.lastValue = null;
    } else {
      this.lastValue = e.option.value;
    }
  }
}
