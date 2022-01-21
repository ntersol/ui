import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";
import { baseValidator } from "./_base.validators";


export const isEqualTo = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator({
    value: charCount,
    evaluatorFn: (value, compareValue) => (typeof value === 'string' || typeof value === 'number') && String(value).length === compareValue,
    errorMessageDefault: (compareValue) => `Please enter exactly <strong>${compareValue} characters</strong>`
}, options);

/**
 * Characters must be equal to
 * @param control
 * @returns

export const isEqualTo = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        let compareValue = charCount;
        if (typeof charCount === 'object' && !!charCount.compareToField) {
            const c = control.root.get(charCount.compareToField);
            if (!c) {
                console.warn(`Unable to find a field of ${charCount.compareToField}`);
                return null;
            }
            compareValue = c.value;
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // If the string or number has the correct number of characters
        if (((typeof value === 'string' || typeof value === 'number') && String(value).length === compareValue) ||
            typeof value === 'undefined' || value === null) {
            return null;
        }

        // Get error messages
        const errorMessage = typeof options?.errorMessage === 'function' ?
            // If function, pass api response and form control
            options?.errorMessage(control) :
            // Use custom error message, otherwise default required message
            options?.errorMessage ?? `Please enter exactly <strong>${compareValue} characters</strong>`;
        // Create error object
        return { [options?.customID ?? 'isEqualTo']: errorMessage };
    }
};
 */

/**
* Characters must be greater than
* @param control
* @returns
*/
export const isGreaterThan = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    let compareValue = charCount;
    if (typeof charCount === 'object' && !!charCount.compareToField) {
        const c = control.root.get(charCount.compareToField);
        if (!c) {
            console.warn(`Unable to find a field of ${charCount.compareToField}`);
            return null;
        }
        compareValue = c.value;
    }

    // Disable additional required validator. Default is all validators are required
    if (!options?.notRequired && !!isRequired(value)) {
        return isRequired(value);
    }

    // If the string or number has the correct number of characters
    if (((typeof value === 'string' || typeof value === 'number') && String(value).length > compareValue)
        || typeof value === 'undefined' || value === null) {
        return null;
    }

    // Get error messages
    const errorMessage = typeof options?.errorMessage === 'function' ?
        // If function, pass api response and form control
        options?.errorMessage(control) :
        // Use custom error message, otherwise default required message
        options?.errorMessage ?? `Please enter more than <strong>${compareValue} characters</strong>`;
    // Create error object
    return { [options?.customID ?? 'isGreaterThan']: errorMessage };
};

/**
* Characters must be less than
* @param control
* @returns
*/
export const isLessThan = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    let compareValue = charCount;
    if (typeof charCount === 'object' && !!charCount.compareToField) {
        const c = control.root.get(charCount.compareToField);
        if (!c) {
            console.warn(`Unable to find a field of ${charCount.compareToField}`);
            return null;
        }
        compareValue = c.value;
    }

    // Disable additional required validator. Default is all validators are required
    if (!options?.notRequired && !!isRequired(value)) {
        return isRequired(value);
    }

    // If the string or number has the correct number of characters
    if (((typeof value === 'string' || typeof value === 'number') && String(value).length < compareValue)
        || typeof value === 'undefined' || value === null) {
        return null;
    }

    // Get error messages
    const errorMessage = typeof options?.errorMessage === 'function' ?
        // If function, pass api response and form control
        options?.errorMessage(control) :
        // Use custom error message, otherwise default required message
        options?.errorMessage ?? `Please enter less than <strong>${compareValue} characters</strong>`;
    // Create error object
    return { [options?.customID ?? 'isLessThan']: errorMessage };
};
