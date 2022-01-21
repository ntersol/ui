import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isGreaterThan = (n: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        let compareValue = n;
        if (typeof n === 'object' && !!n.compareToField) {
            const c = control.root.get(n.compareToField);
            if (!c) {
                console.warn(`Unable to find a field of ${n.compareToField}`);
                return null;
            }
            compareValue = c.value;
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // If number is greater than
        if (
            (typeof value === 'number' && value > compareValue) ||
            (typeof value === 'string' && parseInt(value) > compareValue)
        ) {
            return null;
        }

        // Get error messages
        const errorMessage = typeof options?.errorMessage === 'function' ?
            // If function, pass api response and form control
            options?.errorMessage(control) :
            // Use custom error message, otherwise default required message
            options?.errorMessage ?? `Please enter a number <strong>greater than ${compareValue}</strong>`;
        // Create error object
        return { [options?.customID ?? 'isGreaterThan']: errorMessage };
    }
};

/**
 * Value must be greater than
 * @param control
 * @returns
 */
export const isLessThan = (n: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        let compareValue = n;
        if (typeof n === 'object' && !!n.compareToField) {
            const c = control.root.get(n.compareToField);
            if (!c) {
                console.warn(`Unable to find a field of ${n.compareToField}`);
                return null;
            }
            compareValue = c.value;
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // If number is less than
        if (
            (typeof value === 'number' && value < compareValue) ||
            (typeof value === 'string' && parseInt(value) < compareValue)
        ) {
            return null;
        }

        // Get error messages
        const errorMessage = typeof options?.errorMessage === 'function' ?
            // If function, pass form control
            options?.errorMessage(control) :
            // Use custom error message, otherwise default required message
            options?.errorMessage ?? `Please enter a number <strong>less than ${compareValue}</strong>`;
        // Create error object
        return { [options?.customID ?? 'isLessThan']: errorMessage };
    }
};