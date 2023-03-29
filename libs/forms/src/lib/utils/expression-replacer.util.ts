import { getByPath } from './get-by-path.util';
import { FormControl, FormGroup } from '@angular/forms';
import { applyPipeFormatting } from './apply-pipe-formatting.util';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';

/**
 * Return an observable that combines and dynamic data as defined using Angular curly braces expressions
 *
 * Looks in the form group to determine the correct data
 * @example
 * 'Borrower Name: {{nameFull}}', // Returns 'Borrower Name: John User'
 * @param model
 * @param str
 * @returns
 */
export const expressionReplacer$ = (formGroup?: FormGroup | null, str?: string | null): Observable<string | null> => {
  let strSubject$: Observable<string | null> = new BehaviorSubject(str ?? null);
  // Nil check, return default string
  if (!formGroup || !str) {
    return strSubject$;
  }
  // If string has double curly braces
  if (str && typeof str === 'string' && str.match(/[^{{\}\}]+(?=})/g)) {
    // Split the string by the curly braces
    const content = str.split(/(\{\{.*?\}\})/g);
    // Loop through the new string array
    const stringData: Observable<string>[] = content.map((c) => {
      // If the current index contains double curly braces
      if (c.match(/[^{{\}\}]+(?=})/g)) {
        // Strip double curly braces out
        const path = c.replace(/{{/gi, '').replace(/}}/gi, '');
        // Get the form control from the form group using Reactive Forms dot notation
        let control = formGroup.get(path);
        // If control cannot be found, throw error and return floating control to avoid breaking app
        if (!control) {
          console.error('Unable to find a control at path ', str);
          control = new FormControl('');
        }
        // Return control, start with default value and set nil values to empty string
        return control.valueChanges.pipe(
          startWith(control.value),
          map((val) => val ?? ''),
        );
      } else {
        // No curly braces, just return string in array as is
        return new BehaviorSubject(c);
      }
    });
    strSubject$ = combineLatest(stringData).pipe(map((strs) => strs.reduce((a, b) => a + b), ''));
  }
  // By default just return the str
  return strSubject$.pipe(debounceTime(1), distinctUntilChanged());
};

/**
 *  Replace expressions from a model for a static object
 * @param str
 * @param form
 * @param indexes
 */
export const expressionReplacer = (model: FormGroup, str: string | null | undefined): string => {
  // Get model and array index values
  const modelSrc = model.getRawValue();

  return str && typeof str === 'string' && str.match(/[^{{\}\}]+(?=})/g)
    ? str
        // Get all mustache replacements
        .replace(/[^{{\}\}]+(?=})/g, (strNew) => {
          const pipes = strNew.split('|');
          // Remove first item in the array since its the value
          // All remaining items in the pipes array are ouoes
          strNew = pipes?.shift()?.trim() || '';
          // Get field value
          const result = getByPath(strNew, modelSrc);
          // Check if this is a nested value
          let value = result && result?.value ? result.value : result || '';
          // If pipes are present, apply pipe transformation
          if (pipes.length) {
            value = applyPipeFormatting(value, pipes);
          }
          return value || '';
        })
        // Cleanup anything left over
        .replace(/{{/gi, '')
        .replace(/}}/gi, '')
    : str || '';
};
