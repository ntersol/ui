import { ChangeDetectionStrategy, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

// ngModel pass thru
// https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview
@Component({
  selector: 'nts-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsInputComponent<t> implements OnInit {
  /** Standard html placeholder text */
  @Input() placeholder: string | null = null;
  /** Floating label that appears in front of the content and moves above it when focused */
  @Input() label: string | null = null;
  /** Allow hover functionality */
  @Input() hover = true;

  /** Text to use for ID attribute */
  @Input() id = '';
  /** Text to use for name attribute */
  @Input() name = '';
  /** Any css classes */
  @Input() styleClass = '';
  /** Enable/disable this control, uses the form controls status */
  @Input() set disabled(v: boolean | null) {
    console.log('disabled', v, this.control)
    if (!!this.control && v !== null) {
      !v ? this.control.enable() : this.control.disable();
    }
  }
  get disabled(): boolean {
    return !!this.control?.enabled ?? false;
  }

  /** An icon of text that will appear BEFORE the input */
  @Input() prefix: string | null = null;
  /** An icon of text that will appear AFTER the input */
  @Input() suffix: string | null = null;
  /** Small text that appears beneath the control */
  @Input() hint: string | null = null;
  /** Is this contorl focosued */
  @Input() focused = false;

  // Can't use 'formControl' directly, it's defined incorrectly in the Angular definitions and can't be overriden without a lot of hacky stuff
  // See https://medium.com/youngers-consulting/angular-typed-reactive-forms-22842eb8a181
  // @Input() formControl?: AbstractControl | null = null;
  get formControl(): FormControl {
    return !!this.control ? this.control as FormControl : new FormControl();
  }
  @Input() control?: AbstractControl | null = null;

  constructor() { }

  ngOnInit(): void {
  }


  onBlur() {
    this.focused = false;
  }

  onFocus() {
    this.focused = true;
  }

}
