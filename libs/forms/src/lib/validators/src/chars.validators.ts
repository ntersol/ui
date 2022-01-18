import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";

/**
 * Characters must be equal to
 * @param control
 * @returns
 */
export const isEqualTo = (charCount: number, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // Do not fail validation for nill values. This allows separation from the required validator
        if ([null, undefined].includes(value)) {
            return null;
        }

        // If the string or number has the correct number of characters
        if ((typeof value === 'string' || typeof value === 'number') && String(value).length === charCount) {
            return null;
        }

        return { 'isEqualTo': options?.errorMessage ?? `Please enter exactly <strong>${charCount} characters</strong>` };
    }
};

/**
* Characters must be greater than
* @param control
* @returns
*/
export const isGreaterThan = (charCount: number, options?: NtsForms.ValidatorOptions) => (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // Do not fail validation for nill values. This allows separation from the required validator
    if ([null, undefined].includes(value)) {
        return null;
    }

    // If the string or number has the correct number of characters
    if ((typeof value === 'string' || typeof value === 'number') && String(value).length > charCount) {
        return null;
    }

    return { 'isEqualTo': options?.errorMessage ?? `Please enter more than <strong>${charCount} characters</strong>` };

};

/**
* Characters must be less than
* @param control
* @returns
*/
export const isLessThan = (charCount: number, options?: {
    errorMessage?: string | null
}) => (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // Do not fail validation for nill values. This allows separation from the required validator
    if ([null, undefined].includes(value)) {
        return null;
    }

    // If the string or number has the correct number of characters
    if ((typeof value === 'string' || typeof value === 'number') && String(value).length < charCount) {
        return null;
    }

    return { 'isEqualTo': options?.errorMessage ?? `Please enter less than <strong>${charCount} characters</strong>` };

};