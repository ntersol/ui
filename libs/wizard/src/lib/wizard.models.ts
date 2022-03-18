import { FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { WizardOperator } from './wizard.enums';
/**
 * Marks keys in RS as required
 */
export type MarkRequired<T extends Record<any, any>, RS extends keyof T> = Required<Pick<T, RS>> &
  Pick<T, Exclude<keyof T, RS>>;
// type SomeDataHelper = MarkRequired<SomeData, 'propA'> | MarkRequired<SomeData, 'propB'>;

export namespace Wizard {
  export interface Initial {
    sections: Section[];
    sectionsState?: SectionState[];
    pages: Page[];
    routes: Route[];
    validators?: PageValidator[];
    form: FormGroup;
    arrayIndexes: FormGroup;
    routeParams: RouteParams;
    baseUrl: string;
    state?: State;
  }

  export interface Settings {
    stickyFooter?: boolean;
  }

  export interface RouteAction {
    // sectionUrl?: string;
    // routeUrl?: string;
    event?: 'wizardComplete' | 'sectionComplete' | 'routeNext';
    routeParams?: RouteParams;
  }

  export interface RouteParams {
    sectionUrl?: string;
    routeUrl?: string;
  }

  export interface State {
    ready: boolean;
    sectionUrl: string;
    routeUrl: string;
    routeHistory: string[];
    errorTop: boolean | string;
    errorBottom: boolean | string;
    complete: boolean;
    sectionState: SectionState[];
  }

  export interface SectionState {
    /** UrlSlug of the section */
    sectionId: string;
    /** Is this the currently active section */
    active: boolean;
    /** Has this section been completed */
    completed: boolean;
    /** Date this section was completed */
    completedDate: Date | null;
    /** Last currently visited page */
    routeHistory: string[];
    /** The starting route of this section */
    routeStart: string;
    /** Has this section been started */
    started: boolean;
    /** Date this section was started */
    startedDate: Date | null;
  }

  /**
   * Sections
   */
  export interface SectionControl extends Section {
    src: Section;
    /** Position in the array */
    position: number;
    /** How many routes are in this section */
    readonly routeCount: number;
  }

  export interface Section {
    /** Human readable title */
    readonly title: string;
    /** String to use for url, needs to be unique per section */
    readonly urlSlug: string;
    /** First route of the section, corresponds to urlSlug  */
    readonly routeStart: string;
    readonly options?: Record<string, unknown>;
    readonly data?: unknown;
    /** Should the completion of this section trigger the wizard complete action? */
    readonly wizardComplete?: true;
  }
  /**
   *  & ({ readonly sectionNext: string } | { readonly sectionLast: boolean })
   */

  /**
   * Pages
   */
  export interface PageControl extends Page {
    readonly src: Wizard.Page;
    readonly controlsById: { [key: string]: AbstractControl };
    readonly valid: boolean;
    readonly validPage: boolean;
    readonly validControls: boolean;
    readonly errorTop: string;
    readonly errorBottom: string;
    pageTouched: boolean;
    controlsMarkAsTouched(): void;
    controlsMarkAsUntouched(): void;
  }

  export interface Page {
    /** Human readable title */
    readonly title?: string;
    /** Text for browser title tag. Defaults to title if not supplied */
    readonly titleTag?: string;
    /** Unique ID for page, used for url and joining data */
    readonly id: string;
    /** ID of parent section */
    readonly sectionId: string;
    readonly options?: {
      readonly hideBackButton?: boolean;
      readonly hideNextButton?: boolean;
    };
    readonly data?: unknown;
    readonly canSave?: boolean;
    readonly content: ContentType[] | any;
    /** Corresponds to the ID in the PAGE validators array */
    readonly validatorId?: string;
  }

  export type ContentType = Html | Feature | Row | FormField | ButtonGroup | Wizard.Option;
  export type ContentTypeControl = Html | Feature | Row | FormFieldControl | Content;

  type ContentFormat = 'formField' | 'html' | 'feature' | 'row' | 'buttonGroup';

  export interface Content {
    /** Type of content */
    readonly type: ContentFormat;
    readonly classes?: string;
    readonly data?: unknown;
    /** Is this type of content hidden to the user */
    visible?: boolean | RuleGroup[];
  }

  export interface Html extends Content {
    readonly type: 'html';
    readonly html: string;
  }

  export interface ButtonGroup extends Content {
    readonly type: 'buttonGroup';
    readonly options: [
      {
        label: string;
      },
    ];
  }

  export interface Feature extends Content {
    readonly type: 'feature';
    readonly featureId: string;
    /** TODO: Implement so that page control can see feature validity */
    readonly requiredFields?: any[];
  }

  export interface Row<t = ContentType> extends Content {
    readonly type: 'row';
    readonly columns: Column<t>[];
  }

  export interface Column<t = ContentType> {
    readonly columnSize: number;
    content: t[];
  }

  export type FormField = FormFieldMulti | FormFieldSingle;

  interface FormFieldSingle extends FormFieldSrc {
    readonly formFieldType:
      | 'text'
      | 'number'
      | 'currency'
      | 'phoneNumber'
      | 'email'
      | 'ssn'
      | 'password'
      | 'colorpicker'
      | 'textarea'
      | 'autoComplete'
      | 'date'
      | 'file'
      | 'dropdown'
      | 'button'
      | 'buttons'
      | 'checkbox'
      | 'checkboxSingle'
      | 'multiSelect';
  }

  interface FormFieldMulti extends FormFieldSrc {
    readonly formFieldType:
      | 'select'
      | 'dropdown'
      | 'checkbox'
      | 'checkboxBoolean'
      | 'radio'
      | 'toggle'
      | 'buttonToggle'
      | 'checkboxButtons';
    readonly options?: Option[] | string[]; // TODO | Union type either options or datafield
  }

  interface FormFieldSrc extends Content {
    type: 'formField';
    /** Field or property in the loan model */
    field: string;
    formFieldType: string;
    placeholder?: string;
    hint?: string;
    tooltip?: string;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    maxlength?: number;
    minlength?: number;
    /** If textarea */
    rows?: number;
    /** If a select or button group. This is only for fixed properties, alterntnatively use datafields */
    options?: Option[] | string[];
    /** If a select or button group, use this data from inside the dataField input */
    dataField?: string;
    /** Format to pass to the pipe for custom control */
    format?: string;
    // required?: boolean;
    /** ID of the validator */
    validators?: FieldValidator;
    disabled?: boolean;
  }

  export interface FieldValidator {
    /** Default is true */
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: ValidatorFn[];
  }

  export interface Option {
    label: string;
    value: string | number | boolean;
  }
  export interface RowControl extends Row<ContentControl> {}

  export type ContentControl = ContentTypeControl & { src: Content };

  export interface FormFieldControl extends FormFieldSrc {
    src: FormField;
    formControl: FormControl;
  }

  /**
   * Routing
   */
  export interface RouteControl extends RouteSrc {
    src: Row<ContentControl>;
    routeNext: string;
  }
  /** Routes need at least one of 3 props: routeNext, ruleGRoups or sectionComplete */
  export type Route = RouteNext | RouteComplete;

  export interface RouteComplete extends RouteSrc {
    /** Is this is the last route in the section */
    readonly sectionComplete?: boolean;
  }

  export interface RouteNext extends RouteSrc {
    readonly routeNext: string | (RouteRuleGroup | SectionRuleGroup)[];
  }

  /** Base routing */
  interface RouteSrc {
    /** String to use for url, needs to be unique per section */
    readonly urlSlug: string;
    /** The id of the corresponding section */
    readonly sectionId: string;
    /** The id of the corresponding page */
    readonly pageId: string;
  }

  export interface RouteChange {
    current: Page | null;
    previous: Page | null;
    dir: 'back' | 'next';
  }

  /**
   * Rulegroups
   */
  export type RulesEngine = (ruleGroups: Wizard.RuleGroup[]) => false | Wizard.RuleGroup;

  export interface SectionRuleGroup extends RuleGroup {
    sectionComplete: boolean;
  }

  export interface RouteRuleGroup extends RuleGroup {
    routeNext: string;
  }

  /** TODO: Make condition required if more than one rule */
  export interface RuleGroup {
    [key: string]: any; // Support additional props for rule metadata
    condition?: 'AND' | 'OR';
    rules: Rule[];
  }

  export interface Rule {
    field: string;
    operator: WizardOperator;
    value: any;
  }

  export interface PageValidator {
    id: string;
    /** Custom error message, if any */
    errorMessage?: string;
    fn: PageValidatorFn;
  }

  export type PageValidatorFn = (data: { page?: PageControl; form?: FormGroup }) => boolean; // Add   when object => class
}
