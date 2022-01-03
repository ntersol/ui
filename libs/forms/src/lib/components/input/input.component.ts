import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
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
  /** Is disabled */
  @Input() disabled = false;


  @Input() prefix: string | null = null;
  @Input() suffix: string | null = null;
  @Input() hint: string | null = null;

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

    console.log(this)
  }

  ///////////////
  // OVERRIDES //
  ///////////////
  onBlur() {
    this.focused = false;
  }

  onFocus() {
    this.focused = true;
  }

}
