import { AbstractControl, ValidationErrors } from "@angular/forms";

/**
 * Mark a field as required: not null/undefined/empty string
 * @param control
 * @returns
 */
export const required = (control: AbstractControl): ValidationErrors | null => {
    if (['', null, undefined].includes(control?.value || null)) {
        return { 'required': 'This field is required' };
    }
    return null;
};

// Email form control validator function
export const email = (control: AbstractControl) => {
    const value = control.value;
    const reg = /^([a-z0-9_\-\.]+)@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
    if (value && !reg.test(value)) {
        return {
            email: 'Please enter a valid email address'
        };
    }
    return null;
};