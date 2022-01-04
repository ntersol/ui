import { AbstractControl, ValidationErrors } from "@angular/forms";

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isGreaterThan = (n: number) => {
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

        return { 'isGreaterThan': `Please enter a number <strong>greater than ${n}</strong>` };
    }
};