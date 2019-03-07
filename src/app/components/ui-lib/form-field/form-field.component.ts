import { Component, ChangeDetectionStrategy, Input, Self, Optional, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * A component abstraction for mat-form-field. Adds better design and validation states
 * USAGE: <app-form-field formControlName="address" placeholder="Address"></app-form-field>
 */
@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements ControlValueAccessor, OnInit {
  /** Material design appearance */
  @Input() appearance = 'outline';
  /** Placeholder text */
  @Input() placeholder: string;
  /** Form field type */
  @Input() type: 'text' | 'select' = 'text';
  /** If form field type is select, supply list of options */
  @Input() options: any[];
  /** Is this field required */
  public required = false;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl,
  ) {
    // This is required to successfully implement ControlValueAccessor and
    // also be able to reference ngControl within the template
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    // Determine if field is required or not
    // Angular doesn't have an easier way to determine this
    if (
      this.ngControl
      && this.ngControl.control
      && this.ngControl.control.validator
      && this.ngControl.control.validator(this.ngControl.control)
      && this.ngControl.control.validator(this.ngControl.control).required
    ) {
      this.required = true;
    }
  }

  // These are required for implementing ControlValueAccessor, but they are not used
  // since the FormControl is being passed directly to the Material Design directive
  // in the template
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}

}
