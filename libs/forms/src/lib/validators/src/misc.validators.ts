import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Is the input value required
 * @param value
 * @returns
 */
export const isRequired = (value: any): ValidationErrors | null => {
  if (['', null, undefined].includes(value || null)) {
    return { required: 'This field is required' };
  }
  return null;
};

/**
 * Mark a field as required: IE not null/undefined/empty string
 * @param control
 * @returns
 */
export const requiredValidator = (control: AbstractControl): ValidationErrors | null => isRequired(control?.value);

/**
 * Require a valid email address
 * @param control
 * @returns
 */
export const emailValidator = (control: AbstractControl) => {
  const value = control.value;
  const reg = /^([a-z0-9_\-\.]+)@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
  if (value && !reg.test(value)) {
    return {
      email: 'Please enter a valid email address',
    };
  }
  return null;
};
