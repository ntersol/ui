import { FormGroup, FormControl, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { WizardOperator } from './wizard.enums';
/**
 * Marks keys in RS as required
 */
export type MarkRequired<T extends Record<any, any>, RS extends keyof T> = Required<Pick<T, RS>> & Pick<T, Exclude<keyof T, RS>>;
// type SomeDataHelper = MarkRequired<SomeData, 'propA'> | MarkRequired<SomeData, 'propB'>;

export namespace NtsWizard {
  export interface Initial {
    sections: Section[];
    sectionsState?: SectionState[] | null;
    pages: Page[];
    routes: Route[];
    validators?: ValidatorCustom[] | null;
    variables?: VariableReplacement[] | null;
    form: FormGroup;
    arrayIndexes: FormGroup;
    routeParams: RouteParams;
    baseUrl: string;
    state?: State | null;
  }

  export interface Settings {
    /** If the wizard cannot find the form control of a field property,
     * it will attempt to create the control or entire nested structure
     * automatically. This is useful for building out the form group on demand
     * without needing to know it's structure before the wizard loads.
     * This does add the risk of creating incorrect properties if named incorrectly.
     * Default true.
     */
    dynamicModel?: boolean;
    /** Keep the footer stick and present to the bottom of the screen */
    stickyFooter?: boolean;
    /** Override default settings for wizard navigation buttons (previous/next) */
    buttonsNav?: ButtonsNav;
    /** Modify how the page title is displayed */
    pageTitle?: {
      /** Prepend this string to the page title */
      prepend?: string;
      /** Append this string to the page title */
      append?: string;
    };
  }

  export interface ButtonsNav {
    /** Next button */
    next?: NavButtonSettings;
    /** Prev button */
    prev?: NavButtonSettings;
  }

  /** Settings for wizard navigation buttons (previous/next) */
  export interface NavButtonSettings {
    /** Button text */
    label?: string;
    /** Button icon, null to disable */
    icon?: string | null;
    /** Any css classes */
    classes?: string;
  }

  // TODO: Break this down into smaller type safe models
  export interface RouteAction {
    // sectionUrl?: string;
    // routeUrl?: string;
    event?: 'wizardComplete' | 'sectionComplete' | 'routeNext';
    routeParams?: RouteParams;
  }

  export interface RouteParams {
    sectionUrl: string;
    routeUrl: string;
  }

  export interface State {
    ready: boolean;
    /** Current section */
    sectionUrl: string;
    /** Current route */
    routeUrl: string;
    /** Route history for the current section */
    routeHistory: RouteParams[];
    /** Show an error on the top of the page */
    errorTop: boolean | string;
    /** Show an error on the bottom of the page */
    errorBottom: boolean | string;
    /** Wizard has completed */
    complete: boolean;
    /** State for the individual sections */
    sectionState: SectionState[];
    /** Which direction the current route took */
    routeDir: RouteDirection | null;
    status: Status;
  }

  export interface Status {
    /** Wizard has initialized and is ready */
    ready: boolean;
    /** Wizard has completed */
    complete: boolean;
    /** The next route action is currently waiting on some async process */
    nextWaiting: boolean;
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
    routeHistory: RouteParams[];
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
    routeCount: number;
  }

  export interface Section {
    /** Human readable title. Used for both the display on screen and also the section navigation */
    title: string;
    /** Hide the section title for this entire section. This makes it not visible on the page but still lets it be visible in section navigation */
    hideSectionTitle?: boolean;
    /** String to use for url, needs to be unique per section */
    urlSlug: string;
    /** First route of the section, corresponds to urlSlug  */
    routeStart: string;
    options?: Record<string, unknown>;
    data?: unknown;
    /** Should the completion of this section trigger the wizard complete action? */
    wizardComplete?: true;
  }
  /**
   *  & ({ sectionNext: string } | { sectionLast: boolean })
   */

  /**
   * Pages
   */
  export interface PageControl extends Page<ContentControl> {
    src: NtsWizard.Page;
    controlsById: { [key: string]: AbstractControl };
    contentById: { [key: string]: ContentType };
    valid: boolean;
    validPage: boolean;
    validControls: boolean;
    validRequiredFields: boolean;
    errorTop$: Observable<string | null>;
    errorBottom$: Observable<string | null>;
    /** Show or hide an error message at the top or bottom of the screen */
    errorChange(message: string | null, location?: 'top' | 'bottom'): void;
    pageTouched: boolean;
    controlsMarkAsTouched(): void;
    controlsMarkAsUntouched(): void;
  }

  export interface Page<t = ContentType> {
    /** Human readable title */
    title?: string;
    /** Text for browser title tag. Defaults to title if not supplied */
    titleTag?: string;
    /** Unique ID for page, used for url and joining data */
    id: string;
    /** Hide the section title on this page */
    hideSectionTitle?: boolean;
    /** ID of parent section */
    sectionId: string;
    options?: {
      /** Hide the back button */
      hideBackButton?: boolean;
      /** Hide the next button */
      hideNextButton?: boolean;
    };
    /** Actions to perform at specific events in the page lifecycle */
    actions?: {
      /** Before the page has loaded */
      beforeLoad?: Action | Action[];
      /** After the wizard goes to the next page after passing validation checks */
      afterNext?: Action | Action[];
    };
    /** Override button navigation settings on a page level */
    buttonsNav?: ButtonsNav;
    /** If true, will hide the previous and next buttons and automatically route to the next page when any of the data on the page changes. Useful for simple pages that only have a single required control like Yes/No so that the user doesn't have to click twice to select the option and then click on the next route button*/
    simpleRoute?: boolean;
    data?: unknown;
    canSave?: boolean;
    content: t[];
    /** Page level validators. Typically validation logic that is not specific to the controls on the page */
    validators?: Validators[];

    /**
     * TO BE DEPRECATED
     */
    /** Corresponds to the ID in the PAGE validators array */
    validatorId?: string;
    /** A list of fields required by this page in order to be valid but do not appear in the content array */
    requiredFields?: RequiredFields[];
  }

  export type Validators = ValidatorsRequiredFields | ValidatorsCustom;

  export interface ValidatorsRequiredFields {
    type: 'requiredFields';
    errorMesage: string;
    fields: RequiredFields[];
  }

  export interface ValidatorsCustom {
    type: 'custom';
    validatorId: string;
  }

  export interface RequiredFields {
    field: string;
    errorMesage: string;
    validators?: FieldValidator;
  }

  export type ContentType = Html | Feature | Row | FormField | ButtonSingle | ButtonGroup | Loop;
  export type ContentTypeControl = Html | Feature | Row | FormFieldControl | Content | LoopControl;

  type ContentFormat = 'formField' | 'html' | 'feature' | 'row' | 'button' | 'buttonGroup' | 'loop';

  interface ContentSrc {
    /** An optional unique ID for this content. Currently this is only used to populate the contentById prop on the page control so that content is accessible externally  */
    id?: string;
    classes?: string;
    data?: unknown;
    /** Is this type of content hidden to the user. Supports a boolean, rule group or a string to a form group reference. Also supports ! for flipping truthy or falsy statements
     * @usage
     * Truthy value at this location in the form group
     *
     * visible: 'form.field'
     *
     *
     * Non truthy value at this location in the form group
     *
     * visible: '!form.field'
     *
     *
     * Rule group for more complex rules
     *
     * visible: [
          {
            rules: [
              {
                field: 'form.field',
                operator: WizardOperator.NE,
                value: true,
              },
            ],
          },
        ],
     */
    visible?: boolean | string | RuleGroup[];
    disabled?: boolean | string | RuleGroup[];
  }

  export interface Content extends ContentSrc {
    /** Type of content */
    type: ContentFormat;
    /** An ID unique to this field for the purpose of automated testing. Will look like <div automation-id="yourVal"></div> */
    automationId?: string;
  }

  /** Display rendered html */
  export interface Html extends Content {
    type: 'html';
    html: string;
  }

  export interface Loop extends Content {
    type: 'loop';
    /** A path to a form array control type */
    field: string;
    content: ContentType[];
  }

  export interface LoopControl extends Loop {
    formArray: FormArray;
    src: Loop;
    loopContent: LoopContent[];
    /** If multiple loops on the page, this will be the index of which loop it is in order */
    loopIndex: number;
  }

  export interface LoopContent {
    /** The index of this content within the current loop */
    index: number;
    /** The form control within the form array that corresponds to the index */
    control: any;
    /** Has this model been deleted. Note that this does not actually remove the model from the form array. If a delete was requested via the arrayDeleteItem action, at property of '$$deleted" will be added and set to true for this model. Models with this property are hidden from the DOM and any loops. The actual delete will need to be processed externally of the wizard. */
    deleted: boolean;
    /** Content for the loop */
    content: ContentType;
  }

  export interface ButtonGroup extends Content {
    type: 'buttonGroup';
    /** Should the buttons be stacked horizontally or vertically? */
    orientation?: 'horizontal' | 'vertical';
    options: Button[];
  }

  export interface ButtonSingle extends Button {
    type: 'button';
  }

  export interface Button extends ContentSrc {
    /** Human readable label */
    label: string;
    /** If this button has a datachange action and you want it visually reflect the selection of the associated property. Will toggle between outline and filled button styles */
    hasDataChange?: boolean;
    actions: Action | Action[];
    /** An ID unique to this field for the purpose of automated testing. Will look like <div automation-id="yourVal"></div> */
    automationId?: string;
    src?: Button;
  }

  export interface ActionDataModel {
    control: FormControl;
    value: string | number | boolean;
  }

  export type Action =
    | ActionRouteNext
    | ActionRouteBack
    | ActionRouteGoTo
    | ActionSectionComplete
    | ActionWizardComplete
    | ActionDataChange
    | ActionCustom
    | ActionCopyItem
    | ActionArrayDeleteItem
    | ActionArrayCreateItem
    | ActionArrayUpsertItem
    | ActionRefresh
    | ActionMarkAsUntouched
    | ActionValidityCheck
    | ActionReset;

  export interface ActionRouteNext extends ActionSrc {
    type: 'routeNext';
  }

  export interface ActionRouteBack extends ActionSrc {
    type: 'routeBack';
  }

  export interface ActionRefresh extends ActionSrc {
    type: 'refresh';
  }

  export interface ActionValidityCheck extends ActionSrc {
    type: 'isValid';
    fields: string | string[];
    /** If the above field is valid, perform these actions */
    onValid: Action | Action[];
  }

  export interface ActionMarkAsUntouched extends ActionSrc {
    type: 'markAsUntouched';
    field: string;
  }

  /** Reset a form control */
  export interface ActionReset extends ActionSrc {
    type: 'reset';
    field: string;
  }

  export interface ActionRouteGoTo extends ActionSrc {
    type: 'routeGoTo';
    route: RouteAction;
  }

  export interface ActionSectionComplete extends ActionSrc {
    type: 'sectionComplete';
  }

  /**
   * Fire the wizard complete logic
   */
  export interface ActionWizardComplete extends ActionSrc {
    type: 'wizardComplete';
  }

  /**
   * Change some data within the form model
   */
  export interface ActionDataChange extends ActionSrc {
    type: 'dataChange';
    field: string;
    value: any;
    /** If used within the context of a loop, set the value to the index */
    useIndex?: boolean;
  }

  /** Copy data from one location in the formgroup to another */
  export interface ActionCopyItem extends ActionSrc {
    type: 'copyItem';
    /** The destination in form group to copy the data to */
    fieldTo: string;
    /** The source in the form group to copy the data from */
    fieldFrom: string;
    /** If copying from a form array this is the index of the item in the array. If used within a loop content type and this property is NOT set, it will be receive the index of the current loop */
    index?: number | string;
  }

  /** Create a formgroup/model at the desired location. Will be appended to the form array */
  export interface ActionArrayCreateItem extends ActionSrc {
    type: 'createItem';
    /** Where in the form group to create the model. If the model already exists it will be reset instead. Data in the model will be patched in. */
    fieldTo: string;
    /** Model to use to create the control in the formgroup */
    model: any;
    /** By default any data in the model is added in after form group creation. Set this to true to create only and not add in data. This option lets you control whether or not default data is added */
    skipPatchData?: boolean;
  }

  /** Delete an item from a form array */
  export interface ActionArrayDeleteItem extends ActionSrc {
    type: 'arrayDeleteItem';
    /** The field/path to the form array */
    field: string;
    /** Index in the array to delete. If used within a loop content type and this property is NOT set, it will be receive the index of the current loop */
    index?: number | string;
    /** If true, will pop a confirmation dialogue before processing delete. OPTIONAL: Supply a string for a custom message */
    confirm?: string | boolean;
  }

  /** Create or update a model */
  export interface ActionArrayUpsertItem extends ActionSrc {
    type: 'arrayUpsertItem';
    fieldFrom: string;
    fieldTo: string;
    /** A property within the formgroup that indicates the present of a unique ID. If found will trigger update logic. If not will trigger create logic and add to form array */
    uniqueID: string;
    /** By default the fieldFrom control will be reset after the upsert. Set this to true to leave the source data in place */
    doNotReset?: boolean;
    /** By default the wizard will make sure that the controls in the source item are valid before performing the upsert. If not valid will set touched and show error state. Set to false to perform the upsert without performing validation */
    doNotValidate?: boolean;
  }

  export interface ActionCustom extends ActionSrc {
    type: 'custom';
    payload: any;
  }

  export interface ActionSrc {
    type: string;
    actions?: {
      onSuccess?: Action | Action[];
      onError?: Action | Action[];
    };
  }

  export interface Feature extends Content {
    type: 'feature';
    featureId: string;
    /** TODO: Implement so that page control can see feature validity */
    requiredFields?: string[];
  }

  export interface Row<t = ContentType> extends Content {
    type: 'row';
    /** Number of columns in this row. Uses a standard 12 column grid */
    columns: Column<t>[];
    /** Any css classes to apply to the row */
    classes?: string;
  }

  export interface Column<t = ContentType> {
    /** A number from 1-12 indicating the column width. The total columnsize must match 12 for each row */
    columnSize: number;
    /** Any css classes to apply to the column */
    classes?: string;
    /** Content for this column */
    content: t[];
  }

  export type FormField = FormFieldMulti | FormFieldSingle;

  interface FormFieldSingle extends FormFieldSrc {
    formFieldType:
      | 'text'
      | 'number'
      | 'numberStepper'
      | 'currency'
      | 'phoneNumber'
      | 'email'
      | 'ssn'
      | 'password'
      | 'colorpicker'
      | 'textarea'
      | 'autoComplete'
      | 'date'
      | 'month'
      | 'file'
      | 'dropdown'
      | 'button'
      | 'buttons'
      | 'buttonsStacked'
      | 'checkbox'
      | 'checkboxSingle'
      | 'multiSelect';
  }

  interface FormFieldMulti extends FormFieldSrc {
    formFieldType: 'select' | 'dropdown' | 'checkbox' | 'checkboxBoolean' | 'radio' | 'toggle' | 'buttonToggle' | 'checkboxButtons';
    options?: Option[]; // TODO | Union type either options or datafield
  }

  interface FormFieldSrc extends Content {
    type: 'formField';
    /** Field or property in the loan model */
    field: string;
    formFieldType: any;
    placeholder?: string;
    label?: string;
    hint?: string;
    tooltip?: string;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    maxlength?: number;
    minlength?: number;
    id?: string;
    /** If textarea */
    rows?: number;
    /** Attributes to attach to the input or parent container if prime UI component */
    attributes?: Record<string, string>;
    /** If a select or button group. This is only for fixed properties, alterntnatively use datafields */
    options?: Record<any, any>[];
    /** If a select or button group, use this data from inside the dataField input */
    dataField?: string;
    /** Format to pass to the pipe for custom control */
    format?: string;
    // required?: boolean;
    /** ID of the validator */
    validators?: FieldValidator;
    disabled?: boolean | string | RuleGroup[];
    /** If this type is a button or button group, clicking on the same button twice will deselect by settting value to null. Useful in conjunction with simple routes and buttons. Default true.*/
    canDeselect?: boolean;
    /** The max date user can select from date field */
    maxDate?: any;
    /** The min date user can select from date field */
    minDate?: any;
    /** Makes date input field read only/ user can only select date from calender */
    readonlyDateInput?: boolean;
  }

  export interface FieldValidator {
    /** Default is true */
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: ValidatorFnSync[];
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
    /** Is this is the last route in the section, if so go to next section on completion */
    sectionComplete?: boolean;
  }

  export interface RouteNext extends RouteSrc {
    /** Next route or routes to go to. Can be a static route name OR a rulegroup */
    routeNext: string | (RouteRuleGroup | SectionRuleGroup)[];
  }

  /** Base routing */
  interface RouteSrc {
    /** String to use for url, needs to be unique per section */
    urlSlug: string;
    /** The id of the corresponding section */
    sectionId: string;
    /** The id of the corresponding page */
    pageId: string;
  }

  export interface RouteChange {
    current: PageControl | null;
    previous: PageControl | null;
    dir: RouteDirection | null;
  }

  export type RouteDirection = 'next' | 'back' | 'goto' | 'initial';

  export interface VariableReplacement {
    var: string;
    replaceWith: any;
  }

  /**
   * Rulegroups
   */
  export type RulesEngine = (ruleGroups: NtsWizard.RuleGroup[]) => false | NtsWizard.RuleGroup;

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
    /** If used within the context of a loop, overwrite the value with the index */
    useIndex?: boolean;
  }

  export interface PageValidator {
    id: string;
    /** Custom error message, if any */
    errorMessage?: string;
    fn: ValidatorFn;
  }

  /** A custom validator
  export interface ValidatorCustom {
    type?: 'sync' | 'async';
    id: string;

    fn: ValidatorFnSync;
  }
  */

  /** Custom validators */
  export type ValidatorCustom = ValidatorSync | ValidatorAsync;

  /** A custom validator that is sychronous */
  export interface ValidatorSync {
    type: 'sync';
    /** A unique ID that corresponds to the validator property on the page */
    id: string;
    /** Callback function */
    fn: ValidatorFnSync;
  }

  /** A custom validator that is asychronous. IE needs to perform an api call etc */
  export interface ValidatorAsync {
    type: 'async';
    /** A unique ID that corresponds to the validator property on the page */
    id: string;
    /** Callback function that returns an observable */
    fn: ValidatorFnAsync;
  }

  export type ValidatorFnSync = (data: { page?: PageControl; form?: FormGroup }) => ValidatorFnSuccess | ValidatorFnError; // Add   when object => class
  export type ValidatorFnAsync = (data: { page?: PageControl; form?: FormGroup }) => Observable<ValidatorFnSuccess | ValidatorFnError>; // Add   when object => class

  export interface ValidatorFnSuccess {
    valid: true;
  }
  export interface ValidatorFnError {
    valid: false;
    errorMessage: string;
  }

  /** Actions to perform against the store */
  export interface StateAction<t = unknown, y = unknown> {
    type: string;
    payload: t;
    meta?: y;
  }

  /** Create actions with type safe payloads */
  export interface ActionCreator<t = any> {
    type: string;
    /**
     * Match an action against this action creator
     * @example
     * if (actionCreator.match(action)) {
     *    console.log(action.payload); // Properly typed
     * }
     */
    match: (action: StateAction) => action is StateAction<t, unknown>;
    (payload: t, meta?: unknown): StateAction<t>;
  }
}
