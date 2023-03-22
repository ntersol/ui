// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
export module Forms {
  /** Main form generator model, generic type currently not supported due to infinite recusions issue. Perhaps in a later version of TS */
  export type FormGenerator<t = any> = FormContentTypes<t>;

  type FormContentTypes<t> = (Content<t> | Row<t> | Container<t>)[];

  /** Base properties that apply to all content types  */
  interface FormContentTypeSrc<t> {
    type: string;
    /** CSS ID to apply to the parent container of this element*/
    id?: string | null;
    /** CSS classes to apply to the parent container of this element. Uses [ngClass] */
    cssClasses?: string | null;
    /** Inline style to apply to the parent container of this element.  Uses [ngStyle]  */
    inlineStyles?: { [index: string]: string } | null;
    /**
     * Is the control visible. Supports boolean, a string going to a form control with a truthy/falsy value or a Rule
     *
     * String values support the use of "!" to reverse the truthy or falsey value. IE `visible: '!isActive'`
     *
     * @example
     *
     // Boolean
     visible: true
     // A field in the model, will be dynamically evaluated as truthy or falsey
     visible: 'loan.loanPurpose'
     // A field in the model, will be dynamically evaluated as reverse of truthy or falsey
     visible: '!loan.loanPurpose'
     // Rules engine example, see operators for supported operations
     visible: {
        field: 'loan.loanPurposeType',
        operator: 'eq',
        value: 'Purchase',
      }
     */
    visible?: DynamicProperty<t>;
  }

  /** Supported values for evaluating dynamic properties */
  export type DynamicProperty<t> = null | boolean | string | Rule;

  export interface FormOptions {
    submitButton: {
      label?: string | null;
      icon?: string | null;
      classes?: string | null;
    };
    /** When the user clicks the submit button and an error occurs, the page will scroll to the first error. This value will modify the final position of the scroll and can be negative or positive. Useful for situactions where the error is under a sticky header or fixed element. */
    errorScrollOffset?: number | null;
  }

  /** Container is used for wrapping or grouping other content types */
  export interface Container<t> extends FormContentTypeSrc<t> {
    type: 'container';
    content: FormContentTypes<t>;
  }

  export interface Row<t> extends FormContentTypeSrc<t> {
    type: 'row';
    columns: Column<t>[];
  }

  export interface Column<t> extends FormContentTypeSrc<t> {
    type: 'column';
    width: number;
    content: FormContentTypes<t>;
  }

  export type Content<t> = Html<t> | FormField<t>;

  export interface Html<t> extends FormContentTypeSrc<t> {
    type: 'html';
    html: string;
  }

  /** Available form field types */
  export type FormField<t> =
    | TextField<t>
    | DateField<t>
    | SelectButtonField<t>
    | DropdownField<t>
    | PhoneNumberField<t>
    | EmailField<t>
    | NumberField<t>
    | RadioField<t>
    | TextAreaField<t>
    | ZipCodeField<t>;

  /** Enum for form field types */
  export type FormFieldType =
    | 'text'
    | 'date'
    | 'selectButton'
    | 'dropdown'
    | 'phoneNumber'
    | 'email'
    | 'number'
    | 'radio'
    | 'textarea'
    | 'zipcode';

  export interface FieldOptions {
    label: string;
    value: any;
  }

  /** Props that apply to all form field types, IE input, dropdown, radio, etc */
  interface FieldProps<t> extends FormContentTypeSrc<t> {
    // Required props
    type: 'formField';
    /** Which type of form element is this */
    formFieldType: FormFieldType;
    /** Path/location in the form group of the form control using Angular dot notation, IE `user.data.firstname` */
    field: string;
    // Optional props
    /** Label that appears above the control */
    label?: string | null;
    /** Text to use for ID attribute */
    id?: string | null;
    /** Small text that appears beneath the control */
    hint?: string | null;
    /** A unique ID to use to help facilitate automated testing. Can be different than ID if ID is fixed */
    automationId?: string | null;
    /**  */
    validators?: Validators | null;
    /**
       * Is the control disabled. Supports boolean, a string going to a form control with a truthy/falsy value or a Rule
       *
       * String values support the use of "!" to reverse the truthy or falsey value. IE `visible: '!isActive'`
       *
       * @example
       *
       // Boolean, static
       disabled: true
       // A field in the model, will be dynamically evaluated as truthy or falsey
       disabled: 'loan.loanPurpose'
       // A field in the model, will be dynamically evaluated as reverse of truthy or falsey
       disabled: '!loan.loanPurpose'
       // Rules engine example, see operators for supported operations
       disabled: {
          field: 'loan.loanPurposeType',
          operator: 'eq',
          value: 'Purchase',
        }
       */
    disabled?: DynamicProperty<t>;
  }

  export interface Validators {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    /** Must match the value in another form control exactly */
    mustMatch?: string;
    password?: {
      uppercase?: boolean;
      lowercase?: boolean;
      number?: boolean;
      specialChar?: boolean;
    };
  }

  // Props that apply to only allow typed user input, IE inputs but not dropdowns or radios
  interface FieldInputSrc<t> extends FieldProps<t> {
    // Optional props
    /** Standard html placeholder text */
    placeholder?: string | null;
    /** Is this control focused */
    focused?: boolean | null;
    /** An icon of text that will appear BEFORE the input */
    prefix?: string | null;
    /** An icon of text that will appear AFTER the input */
    suffix?: string | null;
    /** Text to use for name attribute */
    name?: string | null;
  }

  export interface TextField<t> extends FieldInputSrc<t> {
    formFieldType: 'text';
    /** The MAXIMUM number of characters allowed by this input */
    maxLength?: number | null;
    /** The MINIMUM number of characters allowed by this input */
    minLength?: number | null;
  }

  export interface TextAreaField<t> extends FieldInputSrc<t> {
    formFieldType: 'textarea';
    /** 	When present, textarea size expands vertically as the user types */
    autoResize?: boolean | null;
    columns?: number | null;
    rows?: number | null;
    /** Max # of characters allowed in the text area */
    maxlength?: number | null;
  }

  export interface PhoneNumberField<t> extends FieldInputSrc<t> {
    formFieldType: 'phoneNumber';
  }

  export interface ZipCodeField<t> extends FieldInputSrc<t> {
    formFieldType: 'zipcode';
    /** Determine if the value should be either a string or a number. Default string. Number is only supported if allowNineDigitCodes isn't true since the hyphen is required */
    dataType?: 'string' | 'number' | null;
    /** Allow the 9 digit postal code instead of limiting it to 5 digits. IE "92618-1234". The hyphen will only be added if the 6th digit or more is added. Default false */
    allowNineDigitCodes?: boolean | null;
  }

  export interface DateField<t> extends FieldInputSrc<t> {
    formFieldType: 'date';
    // Prime config options
    inline?: boolean | null;
    showIcon?: boolean | null;
    dateFormat?: string | null;
  }

  // TODO: Get union type for requiring EITHER options OR datafield
  // Current error: TS2589: Type instantiation is excessively deep and possibly infinite.
  type Options = { options: FieldOptions[] };
  type Datafield = { datafield: string };
  type FieldPropsOptions = Options | Datafield;
  /** Field props for controls that need an array of data like selects or radios */
  // type FieldPropsOptions<t> = FieldProps<t> & temp3;

  // export type SelectButtonField<t> = SelectButtonFieldSrc<t> & FieldPropsOptions;
  export interface SelectButtonField<t> extends FieldProps<t> {
    formFieldType: 'selectButton';
    options?: FieldOptions[];
    datafield?: string;
    // Prime config options
    multiple?: boolean | null;
    dataKey?: string | null;
    canUnselect?: boolean | null;
    /** Should the button span the entire horizontal space and have all buttons be equal width? Default true */
    fullWidth?: boolean | null;
  }

  // export type DropdownField<t> = DropdownFieldSrc<t> & FieldPropsOptions;
  export interface DropdownField<t> extends FieldProps<t> {
    formFieldType: 'dropdown';
    options?: FieldOptions[];
    datafield?: string | null;
    /** Height of the dropdown box */
    scrollHeight?: string | null;
    /** Append to this element */
    appendTo?: any | null;
    /** Only show visible elements. Useful for large lists */
    virtualScroll?: boolean | null;
    /** Show an X in the menu allowing a user to deselect */
    showClear?: boolean | null;
    /** Standard html placeholder text */
    placeholder?: string | null;
    /** If true, inserts an empty option with the label of the placeholder and a value of null at the top of the list. Essentially a selectable null option  */
    insertEmptyOption?: boolean | null;
  }

  // export type RadioField<t> = RadioFieldSrc<t> & FieldPropsOptions;
  export interface RadioField<t> extends FieldProps<t> {
    formFieldType: 'radio';
    options?: FieldOptions[];
    datafield?: string;
  }

  export interface EmailField<t> extends FieldInputSrc<t> {
    formFieldType: 'email';
  }

  /** Datafields are dynamic options for populating fields from a remote source like an API */
  export type Datafields = Record<string, FieldOptions[]>;

  export interface NumberField<t> extends FieldInputSrc<t> {
    formFieldType: 'number';
    /** The MAXIMUM number of characters allowed by this input */
    maxLength?: number | null;
    mode?: 'decimal' | 'currency';
    currencySymbol?: string | null;
    useGrouping?: boolean | null;

    showButtons?: boolean | null;
    min?: number | null;
    max?: number | null;
    minFractionDigits?: number | null;
    maxFractionDigits?: number | null;
    buttonLayout?: 'stacked' | 'horizontal' | 'vertical' | null;
  }

  export interface Rule {
    field: string;
    operator: 'eq' | 'ne' | 'in' | 'nin';
    value: unknown;
  }
}
