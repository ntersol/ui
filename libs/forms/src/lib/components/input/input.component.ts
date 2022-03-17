import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap, startWith } from 'rxjs/operators';
import { isRequired } from '../../utils';


@UntilDestroy()
@Component({
  selector: 'nts-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NtsInputComponent<t> implements OnInit, OnDestroy {
  /** Standard html placeholder text */
  @Input() placeholder: string | null = null;
  /** Floating label that appears in front of the content and moves above it when focused */
  @Input() label: string | null = null;
  /** Allow hover functionality. If false the label will stay in the hovered position and not cover the control */
  @Input() hover = true;
  /** Is this control focused */
  @Input() focused = false;
  /** An icon of text that will appear BEFORE the input */
  @Input() prefix: string | null = null;
  /** An icon of text that will appear AFTER the input */
  @Input() suffix: string | null = null;
  /** Small text that appears beneath the control */
  @Input() hint: string | null = null;
  /** A unique ID to use to help facilitate automated testing. Can be different than ID if ID is fixed */
  @Input() automationId: string | null = null;

  /** Text to use for ID attribute */
  @Input() id = '';
  /** Text to use for name attribute */
  @Input() name = '';
  /** Any css classes */
  @Input() styleClass = '';
  /** Any inline style */
  @Input() style = '';
  /**
   * Enable/disable this control, uses the form control method instead of template property.
   * Setting the disabled property should be done in the formgroup itself but this
   * allows a parent component to set it via an input which makes it easier to model drive
   */
  @Input() set disabled(v: boolean | null) {
    setTimeout(() => { // A delay is necessary for the child classes to set the formControl
      if (!!this.formControl) {
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
    !!c ? this.formControl = c as FormControl : console.warn('Unable to find that abstract control');
  };

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

  /** When to show or hide errors */
  public showErrors$!: Observable<boolean>;
  /** Convert the errors in the form control error record to something iterable */
  public errors$!: Observable<[string, any][] | null>

  /** Is this field required */
  public required = false;

  /** DOM element for showing required status */
  public requiredTag = `<sup class="required">*</sup>`

  constructor() { }

  ngOnInit(): void {

    // Check if control is required
    if (this.formControl) {
      this.required = isRequired(this.formControl);
    }

    // When value changes, either programmatically OR via the user input
    this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe(v => {
      // Emit changes to onChange event emitter
      this.onChange.emit(v);
    });

    // When to show errors
    // Control is invalid and has been touched
    this.showErrors$ = this.formControl.statusChanges.pipe(
      startWith(this.formControl?.status),
      debounceTime(1),
      map(x => x === 'INVALID' && !!this.formControl?.touched),
      distinctUntilChanged()
    );

    // Convert errors into iterable collection
    this.errors$ = this.formControl.statusChanges.pipe(
      startWith(this.formControl?.errors),
      debounceTime(1),
      map(() => !this.formControl?.errors ? null : Object.entries(this.formControl?.errors))
    );
  }

  /**
   *  On control blur
   */
  blur(e: FocusEvent) {
    this.focused = false;
    this.onBlur.emit(e);
    // Run validation on blur to account for a field that has a value on load and is also invalid
    // Also fixes issues with prime controls that only update on blur
    this.formControl?.updateValueAndValidity();
  }

  /**
   * On control focus
   */
  focus(e: FocusEvent) {
    this.focused = true;
    this.onFocus.emit(e);
  }

  // These are required for implementing ControlValueAccessor, but they are not used
  // since the FormControl is being passed directly to the  directive in the template
  writeValue(): void { }
  registerOnChange(): void { }
  registerOnTouched(): void { }

  ngOnDestroy(): void { }

}
