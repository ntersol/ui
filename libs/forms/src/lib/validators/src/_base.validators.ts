import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";

/**
 *
 * @param config
 * @param options
 * @returns
 */
export const baseValidator = (config: NtsForms.ValidatorBaseOptions, options?: NtsForms.ValidatorOptions) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        let compareValue = config.value;
        if (typeof config.value === 'object' && !!config.value.compareToField) {
            const c = control.root.get(config.value.compareToField);
            if (!c) {
                console.warn(`Unable to find a field of ${config.value.compareToField}`);
                return null;
            }
            compareValue = c.value;
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        //
        if (config.evaluatorFn(value, compareValue) ||
            typeof value === 'undefined' || value === null) {
            return null;
        }

        /**
        // If the string or number has the correct number of characters
        if (((typeof value === 'string' || typeof value === 'number') && String(value).length === compareValue) ||
            typeof value === 'undefined' || value === null) {
            return null;
        }
         */

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