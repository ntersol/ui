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