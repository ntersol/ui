import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NumberComponent extends BaseFormFieldComponent<string> implements OnInit {
  /** The MAXIMUM number of characters allowed by this input, NOT max number */
  @Input() maxLength: number | null = null;
  /** Show or hide spinner buttons */
  @Input() showButtons = false;
  /** Min number to allow, NOT min characters */
  @Input() min: number | null = null;
  /** Max number to allow, NOT max characters */
  @Input() max: number | null = null;

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  /** Use a comma to separate thousands/millions/etc */
  @Input() useGrouping = true;
  /** The minimum number of fraction digits to use */
  @Input() minFractionDigits = 2;
  /** The maximum number of fraction digits to use */
  @Input() maxFractionDigits = 2;
  /** Orientation */
  @Input() buttonLayout?: 'stacked' | 'horizontal' | 'vertical' | null = 'stacked';
  /** Use a comma to separate thousands/millions/etc */
  @Input() currencySymbol: string | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    // If mode is currency, allow cents and add currency symbol
    if (this.mode === 'currency') {
      this.minFractionDigits = this.minFractionDigits ?? 2;
      // this.currencySymbol = this.currencySymbol ?? '$';
    }
  }

  /**
   * When the users enters something in the input
   * @param e
   */
  onInput(e: { originalEvent: KeyboardEvent; value: number }) {
    let value = e.value;
    // If max length was specified, enforce it. Without this the patch on this control will bypass it
    if (this.maxLength) {
      value = parseInt(String(value).slice(0, this.maxLength));
    }
    // Patch the value into the form control on every input change/keypress
    // This fixes an issue with the p-number component because it only updates the form control on blur
    this.formControl?.patchValue(value);
  }
}
