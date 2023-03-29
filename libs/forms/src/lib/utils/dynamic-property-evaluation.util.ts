import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, tap } from 'rxjs';
import { NtsForms } from '../forms.model';
import { is } from './is.util';

/**
 * Get a form control from a screen. Default to floating control if nill
 * @param field
 * @param formGroup
 * @returns
 */
const getControl = (field: string, formGroup: FormGroup) => {
  const control = formGroup.get(field) as FormControl;
  // If no control, return a floating control to avoid breaking the form group
  if (!control) {
    console.warn('Unable to find a control of ', field);
    return new FormControl(true);
  }
  return control;
};

interface Options {
  /** The initial starting default value */
  defaultValue?: boolean;
  /** The # of millseconds to debounce value changes. Default is 1 */
  debounceTime?: number;
}

/**
 * Determine the visibility of an element
 * @param src
 * @param formGroup
 * @returns
 */
export const dynamicPropertyEvaluation$ = (
  src?: null | boolean | string | NtsForms.Rule,
  formGroup?: FormGroup | null,
  options?: Options | null,
): Observable<boolean> => {
  // Set default observable
  let value$ = of(options?.defaultValue ?? true); // Default to true if no default specified
  // Nill check, return default
  if (!formGroup || src === null || src === undefined) {
    return value$;
  }

  /**
   * Boolean tyupe
   */
  if (typeof src === 'boolean') {
    value$ = of(src);
    /**
     * String type
     */
  } else if (typeof src === 'string') {
    let isTruthy = true; // Keep track if a falsey or truthy value is needed
    let path = src; // TS gets confused by reference change
    // If the first char is a "!" then make a falsey statement required
    if (path.charAt(0) === '!') {
      path = path.slice(1); // Remove the "!" to get the correct control
      isTruthy = false;
    }

    const control = getControl(path, formGroup);
    value$ = control.valueChanges.pipe(
      startWith(control.value),
      map(() => (isTruthy ? !!control.value : !control.value)), // Ensure truthy/falsey value
    );
    /**
     * Rules engine type
     */
  } else if (is.rule(src)) {
    const control = getControl(src.field, formGroup);
    value$ = control.valueChanges.pipe(
      startWith(control.value),
      map(() => {
        const value = src.value;
        const formControlValue = control.value;
        // Calculate operators
        // TODO: Add support for more operators
        switch (src.operator) {
          case 'eq': // Equals
            return value === formControlValue;
          case 'ne': // Not Equals
            return value !== formControlValue;
          case 'in': // Included in
            if (!Array.isArray(value)) {
              console.warn('The "in" operator requires an array as a value', src, formControlValue);
              return true;
            }
            return value.includes(formControlValue);
          case 'nin': // Not included in
            if (!Array.isArray(value)) {
              console.warn('The "nin" operator requires an array as a value', src, formControlValue);
              return true;
            }
            return !value.includes(formControlValue);
          case 'gt': // Greater than
            if (is.stringOrNumber(value) && is.stringOrNumber(formControlValue)) {
              const srcValue = typeof value === 'string' ? parseInt(value) : value;
              const compareValue = typeof formControlValue === 'string' ? parseInt(formControlValue) : formControlValue;
              return compareValue > srcValue;
            }
            return false;
          case 'lt': // Greater than
            if (is.stringOrNumber(value) && is.stringOrNumber(formControlValue)) {
              const srcValue = typeof value === 'string' ? parseInt(value) : value;
              const compareValue = typeof formControlValue === 'string' ? parseInt(formControlValue) : formControlValue;
              return compareValue < srcValue;
            }
            return false;
          default:
            console.warn('That operator is not yet supported');
            return true;
        }
      }),
    );
    /**
     * Incorrect type
     */
  } else {
    console.warn('Unknown type for ', src);
  }
  // Return observable with truthy value, and default pipes
  return value$.pipe(debounceTime(options?.debounceTime ?? 1), distinctUntilChanged());
};
