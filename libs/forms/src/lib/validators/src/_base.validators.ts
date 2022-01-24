import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";


/** Is this a config type */
const isConfig = (config: any): config is NtsForms.Config => typeof config.value === 'object' && !!config.value.compareToField;

/**
 *
 * @param config
 * @param options
 * @returns
 */
export const baseValidator = (config: NtsForms.ValidatorBaseOptions, options?: NtsForms.ValidatorOptions) =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Get the value to compare against. Either fixed or from elsewhere in the form group
        const compareValue = extractValue(config, control);

        // If compare value is null then the extractValue config could not find the requested form control
        if (compareValue === null && isConfig(config.value)) {
            // Return an error in the browser with info about the missing control
            return { ['missing-control']: `Unable to find a field of ${config.value.compareToField}` };
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // Evaluate the supplied fn to see it it passes. Also allow through nill values because those are checked above
        if (config.evaluatorFn(value, compareValue) ||
            typeof value === 'undefined' || value === null || value === '') {
            return null;
        }

        // Create the error message
        const err = options?.errorMessage || config?.errorMessageDefault;
        const errorMessage = typeof err === 'function' ? err?.(compareValue as any, control) : err;

        // Create error object
        return { [options?.customID ?? config.id]: errorMessage };
    };

/**
 * Determine the value to evaluate the desired expression against. Can either be a fixed value or another value extracted from the form group
 * @param config
 * @param control
 * @returns
 */
const extractValue = (config: NtsForms.ValidatorBaseOptions, control: AbstractControl): string | number | boolean | null => {
    // If this is a config type with a compare value, get the dynamic field and then its value
    if (isConfig(config.value)) {
        const c = control.root.get(config.value.compareToField);
        // Can't find the control
        if (!c) {
            return null;
        }
        // Return the control's value
        return c.value;
    }
    // Not a config type, return the value
    return config.value;
}