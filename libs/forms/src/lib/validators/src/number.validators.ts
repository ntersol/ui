import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isGreaterThan = (n: number, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (
            (typeof value === 'number' && value > n) ||
            (typeof value === 'string' && parseInt(value) > n) ||
            // Nill values should be set by the required validator
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return { 'isGreaterThan': options?.errorMessage ?? `Please enter a number <strong>greater than ${n}</strong>` };
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
        if (
            (typeof value === 'number' && value < n) ||
            (typeof value === 'string' && parseInt(value) < n) ||
            // Nill values should be set by the required validator
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return { 'isGreaterThan': options?.errorMessage ?? `Please enter a number <strong>less than ${n}</strong>` };
    }
};
