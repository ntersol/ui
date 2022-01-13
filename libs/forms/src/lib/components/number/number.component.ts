import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NtsNumberComponent extends NtsInputComponent<number> implements OnInit {

  /** The MAXIMUM number of characters allowed by this input, NOT max number */
  @Input() maxlength: number | null = null;
  /** Show or hide spinner buttons */
  @Input() showButtons = false;
  /** Min number to allow, NOT min characters */
  @Input() min: number | null = null;
  /** Max number to allow, NOT max characters */
  @Input() max: number | null = null;

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  /** Use a comma to separate thousands/millions/etc */
  @Input() useGrouping = true;
  /** */
  @Input() minFractionDigits = 0;
  /** */
  @Input() maxFractionDigits = 2;

  public value1?: any;

  constructor(
    @Self()
    @Optional()
    private ngControl?: NgControl,
  ) {
    super()
    // This is required to successfully implement ControlValueAccessor and
    // also be able to reference ngControl within the template
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.control = this.ngControl?.control;
    }
    // If mode is currency, allow cents
    if (this.mode === 'currency') {
      this.minFractionDigits = 2;
    }
  }

  /**
   * When the users enters something in the input
   * @param e
   */
  onInput(e: { originalEvent: KeyboardEvent, value: number }) {
    let value = e.value;
    // If max length was specified, enforce it. Without this the patch on this control will bypass it
    if (this.maxlength) {
      value = parseInt(String(value).slice(0, this.maxlength));
    }
    // Patch the value into the form control on every input change/keypress
    // This fixes an issue with the p-number component because it only updates the form control on blur
    this.formControl?.patchValue(value);
  }
}
