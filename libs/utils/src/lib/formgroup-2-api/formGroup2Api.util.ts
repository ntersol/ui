import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface FormGroup2ApiModel {
    /** The path to this entity in the form group using reactive forms dot notation
     * @example
     * loanApplications.borrowers.0.assets
     */
    path: string;
    /** The unique ID of this entity */
    uniqueID: string | number;
    /** Ignore these properties within this formgroup for the purposes of checking for changes (via the dirty flag). Otherwise changes within child or nested models will toggle the dirty flag for this model even though nothing within this model has changed. These properties will also be removed from any api calls. */
    ignoreProps?: string[];
    /** By default all nill values are stripped from the payload sent to the api. Set to true to keep nill values. Also removes empty arrays/objects/strings */
    keepNils?: boolean;
    /** Information about this entity's parent */
    parent?: {
        /** The parent's unique ID */
        uniqueID?: string;
        /** The object property in the current entity to store the parents unique ID */
        parentID?: string;
        /** OPTIONAL: The location of this entity's parent if NOT in the parent property of the form group which is the default */
        path?: string;
    };
    /** API url to make rest calls. Requires restful conventions. If using a callback function, the parent will be the argument */
    apiUrl: string | ApiUrl;
    /** Overide the apiURL on a per verb basis */
    apiUrls?: {
        get?: string | ApiUrl;
        post?: string | ApiUrl;
        put?: string | ApiUrl;
        patch?: string | ApiUrl;
        delete?: string | ApiUrl;
    };
    /** Disable appending the unique ID to the rest call */
    disableAppendID?: {
        get?: boolean;
        post?: boolean;
        put?: boolean;
        patch?: boolean;
        delete?: boolean;
    };
    /** If true, use PUT instead of PATCH with full models instead of just partials for updates */
    replace?: boolean;
    /** A property on the model that if set to true will trigger a deletion. Default is $$delete */
    deleteProp?: string;
}

export interface SelectedControls {
    control: AbstractControl | null;
    model: FormGroup2ApiModel;
}

/** Is the input a form array  */
const isFormArray = (c: unknown): c is FormArray => !!(c as FormArray)?.controls && Array.isArray((c as FormArray).controls);

/** Is the input a form group  */
const isFormGroup = (f: unknown): f is FormGroup => !!(f as FormGroup)?.controls && !Array.isArray((f as FormArray).controls);

/** Callback function that adds this child's parent and the form control of the active model */
type ApiUrl = (parent?: any, control?: AbstractControl) => string;

/**
 * Manage relationships between a form group mega model and a REST endpoint. When this method is called, it will automatically determine which models in the form group need to be saved and where to save them. Includes POST/PUT/PATCH/DELETE.
 *
 * @example
 * // Call to save changes within the model
 * saveFormGroup$(this.http, formGroupModel, formGroup).subscribe()
 * // Sample form group model
 * export const formGroupModel: FormGroup2ApiModel[] = [
  {
    path: 'loanApplication',
    uniqueID: 'guid',
    ignoreProps: ['borrowers', 'property'],
    apiUrl: apiBase + '/loanapplications',
  },
  {
    path: 'loanApplication.borrowers',
    uniqueID: 'guid',
    parent: {
      uniqueID: 'guid',
      parentID: 'loanApplicationGUID',
    },
    apiUrl: (parent: any) => apiBase + '/loanapplications/' + parent[0]?.loanApplicationGUID + '/borrowers',
    apiUrls: {
      patch: apiBase + '/borrowers',
    },
    ignoreProps: [
      'borrowers',
      'assets',
      'currentAddress',
      'realEstateOwned',
      'liabilities',
      'gifts',
      'incomes',
      'employments',
      'demographics',
      'declarations',
    ],
  },
  {
    path: 'loanApplication.borrowers.assets',
    uniqueID: 'guid',
    parent: {
      uniqueID: 'guid',
      parentID: 'borrowerGUID',
    },
    apiUrls: {
      patch: apiBase + '/assets',
      delete: apiBase + '/assets',
    },
    apiUrl: (parent: Models.Borrower) => apiBase + '/borrowers/' + parent.guid + '/assets',
  },
 ]
 * @param models
 * @param formGroup
 * @returns
 */
export const saveFormGroup$ = (http: HttpClient, models: FormGroup2ApiModel[], formGroup: AbstractControl) => {
    const changes = models
        // Extract just the requested abstract controls from the form group using the model
        .map(m => {
            // Split the path to send to the nested model function
            const path = m.path.split('.');
            return getNestedModels(http, path, m, formGroup);
        })
        .reduce((a, b) => [...a, ...b], [])
        .map(m => {
            // Check if any props have been changed
            const props = getChangedProps(m.control, m.model);
            // If props have been changed and a form control is present, get http request
            if (props && m.control) {
                return modelToHttpRequest(http, m.model, m.control);
            }
            return false;
        })
        // Remove any false items in the array, IE they have no changed props
        .filter(m => !!m);
    // Remove all dirty flags
    formGroup.markAsPristine();
    return changes.length ? forkJoin(changes) : false;
};

/**
 * Recurse through an abstract control and extract the nested abstract controls as requested by the model. Supports any combination of deeply nested objects and arrays.
 * @param path
 * @param http
 * @param model
 * @param formGroup
 */
export const getNestedModels = (
    http: HttpClient,
    path: string[],
    model: FormGroup2ApiModel,
    formGroup: AbstractControl,
): SelectedControls[] => {
    // Current path location
    const pathCurrent = path[0];
    // Get next path in series
    const pathNext = [...path].slice(1);
    // Get form control for current path
    const control = formGroup.get(pathCurrent);

    // If current control is a form array
    if (isFormArray(control)) {
        // Loop through array
        return control.controls
            .map(c => {
                // Need to determine if next path is a form group or another nested array
                const pathGoto = pathNext.length ? pathNext : path;
                return getNestedModels(http, pathGoto, model, c);
            })
            .reduce((a, b) => [...a, ...b], []);
        // If form group
    } else if (isFormGroup(control)) {
        return getNestedModels(http, pathNext, model, control);
    } else {
        // Destination path, return form group and model
        return [
            {
                control: formGroup,
                model: model,
            },
        ];
    }
};

/**
 * Takes a form group and returns the object with only the properties that have changed. Only returns shallow changes.
 * @param fg
 * @param options
 * @returns If form control has changed properties, return only those changes. False if no changes
 */
export const getChangedProps = <t = any>(fg: AbstractControl | FormGroup | FormArray | null, model?: FormGroup2ApiModel): Partial<t> | false => {
    if (!fg?.dirty || isFormArray(fg) || !isFormGroup(fg)) {
        return false;
    }
    let obj: any = {};
    // Loop through all the keys in the control
    Object.keys(fg.controls)
        // Remove any keys in the ignored props array
        .filter(key => !model?.ignoreProps?.includes(key))
        .forEach(key => {
            // Get the nested control
            const control = fg.get(key);
            // If the control is dirty, add this property to the object
            if (control?.dirty) {
                obj[key] = control.value;
            }
        });

    // If unique ID is specified, get it from the form group and attach
    // Only attach if the object already has at least one changed prop
    if (model?.uniqueID && Object.keys(obj).length && fg?.value[model.uniqueID]) {
        obj[model.uniqueID] = fg.value[model.uniqueID];
    }

    if (model?.parent?.uniqueID && model?.parent?.parentID && Object.keys(obj).length && fg?.parent?.parent?.value) {
        // Get parent model
        const parent = fg?.parent?.parent?.value;
        // Get parent uniqueId
        const parentID = parent[model.parent.uniqueID];
        // Attach parent ID to child
        obj[model.parent.parentID] = parentID;
    }

    // If keepNills is NOT set, remove all nil entries
    if (!!obj && Object.keys(obj).length && !model?.keepNils) {
        obj = removeNils(obj);
    }

    // If object has at least one changed prop, return obj. Otherwise false
    return Object.keys(obj).length ? obj : false;
};

/**
 * Takes a mega model and a form control and returns an observable of the correct REST api interaction (POST/PUT/PATCH)
 * @param http
 * @param model
 * @param control
 * @param options
 * @returns
 */
export const modelToHttpRequest = (http: HttpClient, model: FormGroup2ApiModel, control: AbstractControl | FormControl | FormGroup) => {
    // Get default data from the form control
    let data = control.value;
    // Get parent data
    // If parent is form array, get parents parent
    const parentData = isFormArray(control?.parent) ? control?.parent?.parent?.value : control.parent?.value;
    // Get unique ID or guid of this model
    const uniqueId = data[model.uniqueID] as string | number | undefined;
    // console.log('modelToHttpRequest', model, control);

    // Get api URL, determine if string or function. Pass parent to function for callback
    let apiUrl = typeof model.apiUrl === 'function' ? model.apiUrl(parentData, control) : model.apiUrl;
    // Hold the http request
    let httpReqest: Observable<any>;

    /**
     * Model contains the deleted flag, this request is a DELETE
     */
    if (data[model?.deleteProp || '$$deleted']) {
        // If PUT has an override url, use that instead of the default
        if (model?.apiUrls?.delete) {
            apiUrl = typeof model.apiUrls.delete === 'function' ? model?.apiUrls?.delete(parentData, control) : model.apiUrls.delete;
        }
        // By default append the unique ID, skip if disabled
        apiUrl = !!model.disableAppendID?.delete ? apiUrl : apiUrl + '/' + data[model.uniqueID];
        httpReqest = http.delete(apiUrl).pipe(
            // On a successful return response
            tap(() => deleteApiResponse(model, control)),
        );
        /**
         * UniqueID exists and replace is requested, this request is a PUT
         */
    } else if (uniqueId && model?.replace) {
        // If PUT has an override url, use that instead of the default
        if (model?.apiUrls?.put) {
            apiUrl = typeof model.apiUrls.put === 'function' ? model?.apiUrls?.put(parentData, control) : model.apiUrls.put;
        }
        // By default append the unique ID, skip if disabled
        apiUrl = !!model.disableAppendID?.put ? apiUrl : apiUrl + '/' + data[model.uniqueID];
        httpReqest = http.put(apiUrl, data);
        /**
         * UniqueID exists, this request is a PATCH
         */
    } else if (uniqueId) {
        data = getChangedProps(control, model);
        // If PATCH has an override url, use that instead of the default
        if (model?.apiUrls?.patch) {
            apiUrl = typeof model.apiUrls.patch === 'function' ? model?.apiUrls?.patch(parentData, control) : model.apiUrls.patch;
        }
        // By default append the unique ID, skip if disabled
        apiUrl = !!model.disableAppendID?.patch ? apiUrl : apiUrl + '/' + data[model.uniqueID];

        httpReqest = http.patch(apiUrl, data);
        /**
         * No uniqueID exists, this request is a POST
         */
    } else {
        data = getChangedProps(control, model);
        // If POST has an override url, use that instead of the default
        if (model?.apiUrls?.post) {
            apiUrl = typeof model.apiUrls.post === 'function' ? model?.apiUrls?.post(parentData, control) : model.apiUrls.post;
        }
        // By default append the unique ID, skip if disabled
        httpReqest = http.post(apiUrl, data);
    }
    // Return the completed request
    return httpReqest.pipe(
        // On a successful return response
        tap(apiResponse => syncApiResponse(model, control, apiResponse)),
    );
};

/**
 * Manage deletions
 * @param model
 * @param control
 * @param parent
 */
const deleteApiResponse = (model: FormGroup2ApiModel, control: AbstractControl) => {
    const parent = control.parent;
    const parentData = parent?.value as any[];
    if (!parent) {
        console.warn('Parent does not exist', model, control);
        return;
    }
    // If form array, delete the item out of the entry
    if (isFormArray(parent)) {
        parentData.forEach((v, i) => {
            // Check for a uniqueID match between the current model and the item in the array
            if (v[model.uniqueID] === control.value[model.uniqueID]) {
                parent.removeAt(i);
            }
        });
    } else {
        console.warn('Need a condition for a non-array deletion');
    }
};

/**
 * Takes a form group and an api response and adds all the data from the api response to the form group
 * @param model
 * @param control
 * @param apiResponse
 */
const syncApiResponse = (model: FormGroup2ApiModel, control: AbstractControl, apiResponse: unknown | void) => {
    // console.warn('syncApiResponse', model, control, apiResponse);
    if (apiResponse && typeof apiResponse === 'string' && model.uniqueID) {
        control.get(String(model.uniqueID))?.patchValue(apiResponse);
    } else if (apiResponse && typeof apiResponse === 'object' && isFormArray(control.parent)) {
        control.patchValue(apiResponse);
        // @TODO: This is handled by the wizard, not sure if that should be the case
        // control.parent.push(control);
        // If any other type, patch back in response to control. IE like a guid so that subsequent responses are PUT/PATCH instead of POST
    } else if (apiResponse && typeof apiResponse === 'object' && !Array.isArray(apiResponse) && isFormGroup(control)) {
        // Loop through all the object properties in the api response
        Object.keys(apiResponse).forEach(key => {
            // Try to get a form control for each
            const c = control.get(key);
            // If no control or property exists, add it
            // Patchvalue will not add new properties so items like a guid on an api response won't get added
            if (!c) {
                control.addControl(key, new FormControl());
            }
        });
        // After all controls have been created, patch in all data
        control.patchValue(apiResponse);
    }
};

/**
 * Remove nils from a JS object. Includes empty strings arrays and objects
 * @param o
 * @returns
 */
const removeNils = (o: Object) =>
    JSON.parse(JSON.stringify(o), (_key, value) => {
        if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === [] ||
            value === {} ||
            (typeof value === 'object' && Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
        ) {
            return undefined;
        }
        if (typeof value === 'object' && Array.isArray(value) && value.length) {
            const val = value.filter(d => !!d);
            return val.length ? val : undefined;
        }
        return value;
    });
