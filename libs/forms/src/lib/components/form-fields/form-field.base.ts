import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { FormControl, AbstractControl, FormGroup, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NtsForms } from '../../forms.model';

@Component({
  selector: 'nts-base-form-field',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormFieldComponent<t> implements OnDestroy {
  /** Standard html placeholder text */
  @Input() placeholder?: string | null = null;
  /** Floating label that appears in front of the content and moves above it when focused */
  @Input() label?: string | null = null;

  /** An icon of text that will appear BEFORE the input */
  @Input() prefix?: string | null = null;
  /** An icon of text that will appear AFTER the input */
  @Input() suffix?: string | null = null;
  /** Small text that appears beneath the control */
  @Input() hint?: string | null = null;
  /** A unique ID to use to help facilitate automated testing. Can be different than ID if ID is fixed */
  @Input() automationId?: string | null = null;

  /** Text to use for ID attribute */
  @Input() id?: string | null = '';
  /** Text to use for name attribute */
  @Input() name?: string | null = '';
  /** Any css classes */
  @Input() styleClass?: string | null = '';
  /** Any inline style */
  @Input() style?: string | null = '';

  /** Validators to attach through the template. Not preferred. */
  @Input() validators?: NtsForms.Validators | null = null;
  /**
   * Enable/disable this control, uses the form control method instead of template property.
   * Setting the disabled property should be done in the formgroup itself but this
   * allows a parent component to set it via an input which makes it easier to model drive
   */
  @Input() set disabled(v: boolean | null) {
    // TODO: Not SSR compatible
    setTimeout(() => {
      // A delay is necessary for the child classes to set the formControl
      if (this.formControl) {
        !v ? this.formControl.enable() : this.formControl.disable();
      }
    });
  }
  get disabled(): boolean {
    return !!this.formControl?.enabled ?? false;
  }

  /** Form control  */
  @Input() formControl = new FormControl();

  /**
   * Using an @Input() of "formControl" has a lot of problems with strict templates
   * Attempting to use the following syntax fails the compiler test: [formControl]="form?.get('zipcode')" because
   * the formControl directive does not support the return type of that get request (AbstractControl | null | undefined)
   * This is a workaround for that limitation
   */
  @Input() set control(c: AbstractControl | null | undefined) {
    if (c) {
      this.formControl = c as FormControl;
    } else {
      console.warn('Unable to find that abstract control of', this.label, 'in', this.constructor.name);
    }
  }

  /** Input ID to use if no ID supplied. Links up label and the form ID */
  public formFieldID = 'form-field-' + Math.floor(Math.random() * 1000000000);

  /** When the input is focused */
  @Output() onFocus = new EventEmitter<FocusEvent>();
  /** When the input is blurred */
  @Output() onBlur = new EventEmitter<FocusEvent>();
  /** When the input is focused */
  @Output() onClick = new EventEmitter<MouseEvent>();
  /** When data on the input is changed */
  @Output() onChange = new EventEmitter<t>();
  /** On keyup event on the input */
  @Output() onKeyup = new EventEmitter<KeyboardEvent>();

  /** Is this control focused */
  public focused?: boolean | null = false;

  /** Main form group. Named slighly different to avoid collision with the formGroup */
  public formGroup?: FormGroup | null = null;

  /** Manage subs used by this class and it's children */
  protected subs: Subscription[] = [];

  constructor(
    @Self()
    @Optional()
    private ngControl?: NgControl,
  ) {
    if (this.ngControl?.control) {
      this.control = this.ngControl.control;
      this.formGroup = this.control?.root as FormGroup;
    }
  }

  /**
   *  On control blur
   */
  public blur(e: FocusEvent) {
    this.focused = false;
    this.onBlur.emit(e);
    // Run validation on blur to account for a field that has a value on load and is also invalid
    // Also fixes issues with prime controls that only update on blur
    this.formControl?.updateValueAndValidity();
  }

  /**
   * On control focus
   */
  public focus(e: FocusEvent) {
    this.focused = true;
    this.onFocus.emit(e);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  // These are required for implementing ControlValueAccessor, but they are not used
  // since the FormControl is being passed directly to the directive in the template
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
}
