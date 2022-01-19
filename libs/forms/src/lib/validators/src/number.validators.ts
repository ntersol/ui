import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isGreaterThan = (n: number, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // If number is greater than
        if (
            (typeof value === 'number' && value > n) ||
            (typeof value === 'string' && parseInt(value) > n) ||
            // Nill values should be set by the required validator
            value === null ||
            value === undefined
        ) {
            return null;
        }

        // Get error messages
        const errorMessage = typeof options?.errorMessage === 'function' ?
            // If function, pass api response and form control
            options?.errorMessage(control) :
            // Use custom error message, otherwise default required message
            options?.errorMessage ?? `Please enter a number <strong>greater than ${n}</strong>`;
        // Create error object
        return { [options?.customID ?? 'isGreaterThan']: errorMessage };
    }
};

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isLessThan = (n: number, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // If number is less than
        if (
            (typeof value === 'number' && value < n) ||
            (typeof value === 'string' && parseInt(value) < n) ||
            // Nill values should be set by the required validator
            value === null ||
            value === undefined
        ) {
            return null;
        }

        // Get error messages
        const errorMessage = typeof options?.errorMessage === 'function' ?
            // If function, pass api response and form control
            options?.errorMessage(control) :
            // Use custom error message, otherwise default required message
            options?.errorMessage ?? `Please enter a number <strong>less than ${n}</strong>`;
        // Create error object
        return { [options?.customID ?? 'isLessThan']: errorMessage };
    }
};
