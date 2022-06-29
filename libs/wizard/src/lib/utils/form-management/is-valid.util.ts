import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Check if the supplied fields are valid
 * @param fields
 * @param formGroup
 * @returns
 */
export const isValid = (fields: string | string[], formGroup?: FormGroup) => {
  if (!formGroup) {
    return false;
  }
  const fieldsArray = Array.isArray(fields) ? fields : [fields];
  fieldsArray.forEach(field => {
    const c = formGroup?.get(field) as FormControl | FormGroup | FormArray | undefined;
    if (c) {
      c.markAllAsTouched();
      c.patchValue(c.value);
    } else {
      console.error('Unable to find a form control of ', field);
    }
  });
  return fieldsArray.reduce((a, field) => {
    const c = formGroup?.get(field) as FormControl | FormGroup | FormArray | undefined;
    return a === false ? false : !!c?.valid;
  }, true);
};
