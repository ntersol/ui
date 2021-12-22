import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsInputComponent),
  multi: true
};
// ngModel pass thru
// https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview
@Component({
  selector: 'nts-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NtsInputComponent<t> implements OnInit, ControlValueAccessor {

  @Input() placeholder: string | null = null;
  @Input() label: string | null = null;
  @Input() hover = true;

  @Input() prefix: string | null = null;
  @Input() suffix: string | null = null;

  @Input() focused = false;

  // Can't use 'formControl', it's defined incorrectly in the Angular definitions and can't be overriden without a lot of hacky stuff
  // See https://medium.com/youngers-consulting/angular-typed-reactive-forms-22842eb8a181
  // @Input() formControl?: AbstractControl | null = null;
  @Input() control?: AbstractControl | null = null;

  /** Manage value internally in the class */
  protected innerValue: t | null = null;

  constructor() { }

  ngOnInit(): void {

    console.log(this)
  }

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  protected onTouchedCallback: () => void = noop;
  protected onChangeCallback: (_: t | null) => void = noop;

  //Get accessor
  @Input() get value(): t | null {
    return this.innerValue;
  };

  //Set accessor including call the onchange callback
  set value(v: t | null) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(this.innerValue);
    }
  }

  ///////////////
  // OVERRIDES //
  ///////////////
  onBlur() {
    this.focused = false;
    this.onTouchedCallback();
  }

  onFocus() {
    this.focused = true;
  }

  //From ControlValueAccessor interface
  writeValue(value: t) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
