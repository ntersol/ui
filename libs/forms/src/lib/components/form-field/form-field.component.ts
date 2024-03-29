import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Self,
  Optional,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { NgControl, FormControl, AbstractControl } from '@angular/forms';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { isRequired } from '../../utils/isRequired.util';
import { SelectItem } from 'primeng/api';
import { slugCreateUniqueId } from '../../utils/slug.util';
import { formControlGetFieldName } from '../../utils/formFieldName.util';
import { isType } from '../../utils/typeguard.util';
import { distinctUntilChanged, skip, startWith } from 'rxjs/operators';
import { InputNumber } from 'primeng/inputnumber';

export type NtsFormFieldType =
  | 'text'
  | 'number' // Uses type="number" and ensures the value in the form is a number
  | 'numberStepper'
  // | 'numberAsString' // Uses type="number" but keeps the numeric value as a string (default behavior)
  | 'currency'
  | 'phoneNumber'
  | 'email'
  | 'password'
  // Non text input types
  | 'colorpicker'
  | 'ssn'
  | 'select' // Native browser select
  | 'dropdown' // NgPrime dropdown
  | 'textarea'
  | 'checkbox'
  | 'checkboxBoolean'
  | 'radio'
  | 'toggle'
  | 'autoComplete'
  | 'date'
  | 'month'
  | 'buttons'
  | 'buttonsStacked'
  | 'buttonGroup'
  | 'buttonToggle';

/**
 * Tools for rapidly creating and managing forms
 */
@UntilDestroy()
@Component({
  selector: 'nts-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsFormFieldComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** A dictionary that helps manage unique name and id properties. This is on the class so all instances on a page can be made unique */
  static uniqueIds: Record<string, number>;
  /** Some ui controls need an ngModel to store data if a form control is not supplied */
  public model: any;

  @Input() type: NtsFormFieldType = 'text';
  /** Determine if this is a generic fieldtype */
  public fieldType!: string;
  /** Placeholder text */
  @Input() placeholder?: string | null = null;
  /** Separate text for the label if it needs to be different than the placeholder. If label is specified, placeholder will be the actual input placeholder. If set this will also make the float label on by default */
  @Input() label?: string | null = null;
  /** A unique ID to use to help facilitate automated testing. Can be different than ID if ID is fixed */
  @Input() automationId: string | null = '';
  /** Should the placeholder be a traditional inline one or a float version */
  @Input() placeholderFloat = true;

  /** Text to use for ID attribute */
  @Input() id: string | null = 'nts-id-' + Math.floor(Math.random() * 1000000);
  /** Text to use for name attribute, autogenerated so that radio and checkbox controls are automatically grouped */
  @Input() name: string | null = null;
  /** Any css classes */
  @Input() class = '';
  /** Is disabled */
  @Input() disabledChange = false;

  /** If form field type is select, supply list of options */
  @Input() options: Record<any, any>[] | null = null;
  /** The human readable label for an option */
  @Input() optionLabel = 'label';
  /** The value for the option to supply to the form control */
  @Input() optionValue = 'value';

  /** Tooltip text */
  @Input() tooltip?: string;
  /** Hint text */
  @Input() hint?: string;
  /** HTML code to place in the prefix position in FRONT of the form field */
  @Input() prefix?: string;
  /** HTML code to place in the suffix position in BACK of the form field */
  @Input() suffix?: string;

  /** Show success icon when valid */
  @Input() showSuccess = false;
  /** Show error icon when invalid */
  @Input() showError = true;
  /** Show custom error message */
  @Input() errorCustom: false | string = false;
  /** Form control reference */
  @Input() formControl = new FormControl();

  /** If field type is text area, use this many columns */
  @Input() rows = 4;
  /** If NUMBER, the max value allowed */
  @Input() max: number | null = null;
  /** If NUMBER, the min value allowed */
  @Input() min: number | null = null;
  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxLength: number | null = null;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minLength: number | null = null;

  /** Should form controls with input masks return the raw data or the masksed/formatted data? */
  @Input() unmask = true;
  /** Content for autocomplete html ATTRIBUTE, not autocomplete control */
  @Input() autocomplete?: string;
  /** Key value pairs to to attach attributes to the input */
  @Input() attributes?: Record<string, string>;
  /** Does the current input have focus or data. Used to toggle the label */
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  /** If this type is a button or button group, clicking on the same button twice will deselect by settting value to null*/
  @Input() canDeselect?: boolean = true;
  /** The max date user can select from date field */
  @Input() maxDate?: any;
  /** The min date user can select from date field */
  @Input() minDate?: any;
  /** Makes date input field read only/ user can only select date from calender */
  @Input() readonlyDateInput?: boolean | null = false;
  /** Used by the password control to show or hide the password */
  public showPassword = false;

  @ViewChild('field') field!: ElementRef;

  public focused = false;

  public autoCompleteSuggestions: any[] = [];

  public optionsOutput?: SelectItem[];

  public optionIsObjectsArray = true;
  /** Typeguards */
  public isType = isType;

  /** Is this field required */
  public required = false;
  public requiredAsterisk = '';

  private isLoaded = false;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl,
    private ref: ChangeDetectorRef,
  ) {
    // This is required to successfully implement ControlValueAccessor and
    // also be able to reference ngControl within the template
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    // Check if required, set required flag
    if (this.ngControl && this.ngControl.control) {
      this.formControl = <FormControl>this.ngControl.control;
    } else if (!this.formControl) {
      this.formControl = new FormControl();
    }

    // Check if control has a required flag
    this.required = isRequired(this.formControl);
    // If control is required, add a required asterisk to placeholder
    this.requiredAsterisk = this.required ? '<sup class="required">*</sup>' : '';

    // Fixes a bug with input masks where default data is not displayed on load
    if (this.type === 'phoneNumber') {
      setTimeout(() => this.formControl?.patchValue(this.formControl.value), 10);
    }

    // The ngPrime control requires an actual date object and isn't smart enough to convert a string to a date
    if ((this.type === 'date' || this.type === 'month') && typeof this.formControl.value === 'string') {
      this.formControl.patchValue(new Date(this.formControl.value));
    }

    // Fix a primeng bug where radio buttons are not unselected if a form control is used
    if (this.type === 'radio') {
      this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe(e => this.formControl.setValue(e, { emitEvent: false }));
    }

    // Set dollar sign as default prefix for currency controls
    if (this.type === 'currency' && this.prefix === undefined) {
      this.prefix = '$';
    }

    // Dates by default have two placeholders. Set focused so that the label isn't covering the control
    if (this.type === 'date' || this.type === 'month') {
      this.focused = true;
    }

    // Update model if form control changes but only if changed
    this.formControl.valueChanges
      .pipe(untilDestroyed(this), startWith(this.formControl.value), distinctUntilChanged(), skip(1))
      .subscribe(val => {
        this.minMaxChanges();
        this.model = val;
        this.formControl?.markAsDirty(); // Dynamically created form controls do not set dirty flag automatically
      });
    // If form control statuses are updated programatically, fire change detection
    this.formControl.statusChanges.pipe(untilDestroyed(this)).subscribe(() => this.ref.markForCheck());

    this.inputChanged();
    this.isLoaded = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.disabledChange?.currentValue === true) {
      this.formControl.disable({ emitEvent: false });
    }

    if (changes?.disabledChange?.currentValue === false) {
      this.formControl.enable({ emitEvent: false });
    }

    if (this.isLoaded) {
      this.inputChanged();
    }
  }

  ngAfterViewInit(): void {
    if (this.field && this.attributes) {
      Object.entries(this.attributes).forEach(e => this.field?.nativeElement?.setAttribute(e[0], e[1]));
    }
  }

  public minMaxChanges() {
    if (this.type === 'number' && this.formControl?.value) {
      if (this.max && this.formControl.value > this.max) {
        this.formControl.setValue(null);
      }
      if (this.min && this.formControl.value < this.min) {
        this.formControl.setValue(null);
      }
    }
  }

  /**
   * When an input was changed
   */
  public inputChanged() {
    // Determine if this is a generic field type
    this.fieldType = [
      'text',
      'number',
      'numberAsString',
      'currency',
      'phoneNumber',
      'email',
      'ssn',
      'password',
      'date',
      'month',
      'colorpicker',
    ].includes(this.type)
      ? 'generic'
      : this.type;

    // Determine if the control needs to generate a unique id and or name property from the placeholder or the field name
    if ((this.placeholder && (!this.name || !this.id)) || !this.placeholder) {
      const name = this.placeholder ? this.placeholder : formControlGetFieldName(this.formControl as FormControl); // TODO: Add typeguard
      // Create slug, ensure slug is unique
      const slug = slugCreateUniqueId(name, NtsFormFieldComponent);
      // If name not supplied, autogenerate one from the placeholder
      if (!this.name) {
        this.name = slug;
      }
      // If id not supplied, autogenerate one from the placeholder
      if (!this.id) {
        this.id = slug;
      }
    }
    // If this is an options based control, determine if it is a string array or an object array
    if (this.options && typeof this.options[0] === 'string') {
      this.optionIsObjectsArray = false;
    }

    // Set model for default
    this.model = this.formControl?.value;
    // If field type is a dropdown, add a null option
    if (this.type === 'dropdown' && this.options && this.optionIsObjectsArray) {
      this.optionsOutput = this.dropdownAddNullOption(<SelectItem[]>this.options);
    }
  }

  /**
   * When the date is changed
   * Wrapped in setTimeout because the date control isn't immediately available from the component
   * This is necessary to extract the correctly formatted version of the date and not the JS date type
   * @param date
   */
  public dateChange(date: Date) {
    // Patch value from datepicker to control
    this.formControl?.patchValue(date);
    this.formControl?.markAsDirty();
    this.formControl?.markAllAsTouched();
  }

  /**
   * Manage the formatting of the date
   * @param e
   * @param addYear
   * @returns
   */
  public dateFormat(e: any, fullDate = true) {
    let value = e?.inputfieldViewChild?.nativeElement?.value as string;
    if (!value) {
      return;
    }

    if (value.charAt(2) === '/' && value.charAt(3) === '/') {
      value = value.slice(0, 2);
    }

    if (value.charAt(5) === '/' && value.charAt(6) === '/') {
      value = value.slice(0, 5);
    }

    // For a single digit number where the user manually adds the backslash, add in leading 0
    if (value.length === 2 && value.includes('/')) {
      e.inputfieldViewChild.nativeElement.value = '0' + value;
    }

    // For a double digit number, automatically add the backslash
    if (value.length === 2 && !value.includes('/')) {
      e.inputfieldViewChild.nativeElement.value = value + '/';
    }

    if (!fullDate) {
      return;
    }

    //
    if (value.length === 5 && value.split('/').length === 3) {
      let split = value.split('/');
      split[1] = '0' + split[1];
      e.inputfieldViewChild.nativeElement.value = split.join('/');
    } else if (value.length === 5) {
      e.inputfieldViewChild.nativeElement.value = value + '/';
    }
  }

  /**
   * On currency change
   * @param currency
   */
  public currencyChange(currency: InputNumber) {
    // Update source control and remove any formatted
    this.formControl?.setValue(currency.value, {
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false,
    });
  }

  /**
   * When an input mask control is selected, always move the cursor to the first available position
   * This resolves an issue where clicking on the field would move the cursor to the last position in the input
   * @param field - Reference to component
   * @param cursorPos - Position to place the cursor at
   */
  public cursorPositionSet(field: any, cursorPos = 0) {
    const val = this.formControl?.value;
    const compRef = field?.el?.nativeElement?.children[0];
    // Make sure an reference to the input was found and has the setSelectionRange available
    // Check if form control is null or empty string
    if (compRef && compRef.setSelectionRange && (val === null || val === '')) {
      // Set selection range twice, one at 25ms and one at 100ms
      // This prevents a FOUC with the 25 since the 25 doesn't always set the range so the 100 ensure it's set correctly
      setTimeout(() => compRef.setSelectionRange(cursorPos, cursorPos), 25);
      setTimeout(() => compRef.setSelectionRange(cursorPos, cursorPos), 100);
    }
  }

  /**
   * Filter the available autocomplete terms based on the query typed by the user
   * @param result
   */
  public autoCompleteFilterTerms(result: { originalEvent: Event; query: string }) {
    const term = result.query.toLowerCase().trim();
    if (this.options && this.options.length) {
      if (typeof this.options[0] === 'object') {
        this.autoCompleteSuggestions = (<SelectItem[]>this.options).filter(option => {
          const optionTerm = String((<any>option)[this.optionLabel])
            .toLowerCase()
            .trim();
          return optionTerm.indexOf(term) !== -1 ? true : false;
        });
      } else if (typeof this.options[0] === 'string') {
        this.autoCompleteSuggestions = this.options.filter(option => {
          const optionTerm = String(option).toLowerCase().trim();
          return optionTerm.indexOf(term) !== -1 ? true : false;
        });
      } else {
        console.error('Unknown types in options array');
      }
    }
  }

  /**
   * When an autocomplete is selected, patch it back to the control
   * @param term
   */
  public autoCompleteSelection(term: SelectItem) {
    const val = (<any>term)[this.optionValue] || term;
    if (val !== undefined) {
      this.formControl?.patchValue(val);
    }
    this.model = term;
  }

  /**
   *  Used by the checkbox button to add remove selected values to ngmodel and update the form array
   * @param value
   */
  public toggleInArray(value: string | number | boolean) {
    if (!this.model) {
      this.model = [];
    }

    if (Array.isArray(this.model)) {
      this.model = this.model.includes(value) ? this.model.filter(x => x !== value) : [...this.model, value];
      this.ngModelToFormArray();
    }
  }

  /**
   * For select dropdowns, add a nicely formatted value for nulls
   * @param options
   */
  private dropdownAddNullOption(options: SelectItem[]): SelectItem[] {
    // Make sure a default null value was not passed
    const hasNull = options.reduce((a, b) => (a || b.value === null ? true : false), false);
    if (!hasNull) {
      const option: any = { disabled: true, styleClass: 'disabled' }; // SelectItem
      option[this.optionLabel] = '-- Please Select --';
      option[this.optionValue] = null;
      return [option, ...options];
    }
    return options;
  }

  /**
   * Sync an ngmodel array with a form array
   * Works by removing all controls within the form array and only adding back in the ones selected in ngmodel
   */
  public ngModelToFormArray() {
    const src = [...this.model];
    if (this.isType.formArray(this.formControl)) {
      const length = this.formControl.controls.length;
      for (let i = 0; i < length; i++) {
        this.formControl.removeAt(0);
      }
      if (Array.isArray(this.model)) {
        src.forEach(m => {
          if (this.isType.formArray(this.formControl)) {
            this.formControl.push(new FormControl(m));
          }
        });
      }
    }
  }

  onChangeDropdown(event: any): void {
    this.onChange.emit(event);
  }

  handleButtonsClick(value: any) {
    if (this.formControl?.value === value && this.canDeselect) {
      this.formControl?.patchValue(null); // <-Need to be able to toggle deselect
    } else {
      this.formControl?.patchValue(value);
    }
  }

  // These are required for implementing ControlValueAccessor, but they are not used
  // since the FormControl is being passed directly to the directive in the template
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}

  ngOnDestroy() {}
}
