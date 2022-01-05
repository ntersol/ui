import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';


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
  /** Is this contorl focused */
  @Input() focused = false;
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


  public initialTouch = false;

  public showErrors$!: Observable<boolean>;
  public errors$!: Observable<[string, any][] | null>

  constructor() {
  }

  ngOnInit(): void {
    // Emit changes to onChange event emitter
    this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe(v => {
      this.onChange.emit(v);
      this.control?.markAsTouched();
    });

    // When to show errors
    // Control is invalid and has been touched
    this.showErrors$ = this.formControl.statusChanges.pipe(
      startWith(this.control?.status),
      debounceTime(1),
      map(x => x === 'INVALID' && !!this.control?.touched),
      distinctUntilChanged()
    );

    // Convert errors into iterable collection
    this.errors$ = this.formControl.statusChanges.pipe(
      startWith(this.control?.errors),
      debounceTime(1),
      map(() => !this.control?.errors ? null : Object.entries(this.control?.errors))
    );
  }


  /**
   *  On control blur
   */
  blur(e: FocusEvent) {
    this.focused = false;
    this.onBlur.emit(e);
    // Run validation on blur to account for a field that has a value on load and is also invalid
    this.control?.updateValueAndValidity();
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
