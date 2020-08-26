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
  Output, EventEmitter,
} from '@angular/core';
import { NgControl, FormControl, FormArray } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { isRequired } from '../../utils/isRequired.util';
import { Spinner } from 'primeng/spinner';
import { SelectItem } from 'primeng/api';
import { slugCreateUniqueId } from '../../utils/slug.util';
import { currencyChange } from '../../utils/currency.util';
import { formControlGetFieldName } from '../../utils/formFieldName.util';
import { isType } from '../../utils/typeguard.util';

export type FormFieldType =
  | 'text'
  | 'number' // Uses type="number" and ensures the value in the form is a number
  // | 'numberAsString' // Uses type="number" but keeps the numeric value as a string (default behavior)
  | 'currency'
  | 'phoneNumber'
  | 'email'
  | 'ssn'
  | 'password'
  | 'colorpicker'
  // Non text input types
  | 'select' // Native browser select
  | 'dropdown' // NgPrime dropdown
  | 'textarea'
  | 'checkbox'
  | 'checkboxBoolean'
  | 'radio'
  | 'toggle'
  | 'autoComplete'
  | 'file'
  | 'buttons'
  | 'date'
  | 'buttonGroup'
  | 'buttonToggle';

/**
 * Tools for rapidly creating and managing forms
 */
@Component({
  selector: 'nts-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsFormFieldComponent implements OnInit, OnChanges, OnDestroy {
  /** A dictionary that helps manage unique name and id properties. This is on the class so all instances on a page can be made unique */
  static uniqueIds: Record<string, number>;
  /** Some ui controls need an ngModel to store data if a form control is not supplied */
  public model: any;

  @Input() type: FormFieldType = 'text';
  /** Determine if this is a generic fieldtype */
  public fieldType!: string;
  /** Placeholder text */
  @Input() placeholder?: string;
  /** Should the placeholder be a traditional inline one or a float version */
  @Input() placeholderFloat = true;

  /** Text to use for ID attribute */
  @Input() id?: string;
  /** Text to use for name attribute */
  @Input() name?: string;
  /** Any css classes */
  @Input() class = '';
  /** Is disabled */
  @Input() disabled = false;

  /** If form field type is select, supply list of options */
  @Input() options?: SelectItem[] | string[];
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

  /** If field type is text area, use this many columns */
  @Input() rows = 4;
  /** If NUMBER, the max value allowed */
  @Input() max?: number;
  /** If NUMBER, the min value allowed */
  @Input() min?: number;
  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxlength?: number;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minlength?: number;

  /** Should form controls with input masks return the raw data or the masksed/formatted data? */
  @Input() unmask = true;
  /** Content for autocomplete html ATTRIBUTE, not autocomplete control */
  @Input() autocomplete?: string;

  /** Pass formcontrol reference */
  @Input() formControl!: FormControl | FormArray;
  /** Does the current input have focus or data. Used to toggle the label */

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  public focused = false;

  public autoCompleteSuggestions?: any[];

  public optionsOutput?: SelectItem[];

  public optionIsObjectsArray = true;
  /** Typeguards */
  public isType = isType;

  /** Is this field required */
  public required = false;

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
    if (!this.formControl && this.ngControl && this.ngControl.control) {
      this.required = isRequired(this.ngControl);
      this.formControl = <FormControl>this.ngControl.control;
    } else if (!this.formControl) {
      this.formControl = new FormControl();
    }

    // Fixes a bug with input masks where default data is not displayed on load
    if (this.type === 'phoneNumber') {
      setTimeout(() => this.formControl.patchValue(this.formControl.value), 10);
    }

    // Fixes a bug with input masks where default data is not displayed on load
    // Also fix a bug with the input mask where it can't handle normal JS datestamps
    // IE convert 2020-07-02T00:00:00Z > 07/02/2020
    if (this.type === 'date') {
      let val = this.formControl.value;
      // Server timestamped
      if (val && val.includes('T')) {
        const dt = val.split('T')[0].split('-');
        val = dt[1] + '/' + dt[2] + '/' + dt[0];
      }
      setTimeout(() => this.formControl.patchValue(val), 10);
    }

    // Set dollar sign as default prefix for currency controls
    if (this.type === 'currency' && this.prefix === undefined) {
      this.prefix = '$';
    }

    // Dates by default have two placeholders. Set focused so that the label isn't covering the control
    if (this.type === 'date') {
      this.focused = true;
    }

    // Update model if form control changes
    this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.model = val;
      this.formControl.markAsDirty(); // Dynamically created form controls do not set dirty flag automatically
    });
    // If form control statuses are updated programatically, fire change detection
    this.formControl.statusChanges.pipe(untilDestroyed(this)).subscribe(() => this.ref.markForCheck());

    this.inputChanged();
    this.isLoaded = true;
  }

  ngOnChanges() {
    if (this.isLoaded) {
      this.inputChanged();
    }
  }

  /**
   * When an input was changed
   */
  public inputChanged() {
    // Determine if this is a generic field type
    this.fieldType = ['text', 'number', 'numberAsString', 'currency', 'phoneNumber', 'email', 'ssn', 'password', 'date', 'colorpicker'].includes(this.type)
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
    this.model = this.formControl.value;
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
  public dateChange(date: any) {
    // Selected date not immediately available from control
    setTimeout(() => {
      if (!date || !date.inputFieldValue) {
        return;
      }
      // Patch value from datepicker to control
      // Cap str length to 10, fixes bug with datepicker output format
      this.formControl.patchValue(date.inputFieldValue.substring(0, 10));
    });
  }

  /**
   * On currency change
   * @param currency
   */
  public currencyChange(currency: Spinner) {
    // Get cursorPositionSeted value, manage all currency change logic
    const val = currencyChange(currency);
    // Update source control and remove any formatted
    this.formControl.setValue(val.replace(/[^\d.]/, ''), {
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
    const val = this.formControl.value;
    const compRef = field.el.nativeElement.children[0];
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
        this.autoCompleteSuggestions = (<string[]>this.options).filter(option => {
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
      this.formControl.patchValue(val);
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

  // These are required for implementing ControlValueAccessor, but they are not used
  // since the FormControl is being passed directly to the directive in the template
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}

  ngOnDestroy() {}
}
