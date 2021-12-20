import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsInputComponent),
  multi: true
};

@Component({
  selector: 'nts-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NtsInputComponent<t> implements OnInit, ControlValueAccessor { //

  @Input() type = 'text';
  @Input() placeholder: string | null = null;
  @Input() label: string | null = null;
  @Input() hover = true;

  public focused = false;

  /** Manage value internally in the class */
  private innerValue: t | null = null;

  constructor() { }

  ngOnInit(): void { }

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: t | null) => void = noop;

  //get accessor
  get value(): t | null {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: t | null) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
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
