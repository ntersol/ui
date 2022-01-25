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
export const baseValidator = <t>(compareValueSrc: t | NtsForms.Config, config: NtsForms.ValidatorBaseOptions<t>, options?: NtsForms.ValidatorOptions) =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Get the value to compare against. Either fixed or from elsewhere in the form group
        const compareValue = extractValue(compareValueSrc, control);

        // If compare value is null then the extractValue config could not find the requested form control
        if (compareValue === null && isConfig(compareValueSrc)) {
            // Return an error in the browser with info about the missing control
            return { ['missing-control']: `Unable to find a field of ${compareValueSrc.compareToField}` };
        }

        // Disable additional required validator. Default is all validators are required
        if (!options?.notRequired && !!isRequired(value)) {
            return isRequired(value);
        }

        // Evaluate the supplied fn to see it it passes. Also allow through nill values because those are checked above
        if (config.evaluatorFn(value, compareValue, control) ||
            typeof value === 'undefined' || value === null || value === '') {
            return null;
        }

        // Create the error message
        const err = options?.errorMessage || config?.errorMessageDefault;
        const errorMessage = typeof err === 'function' ? err?.(compareValue, control) : err;

        // Create error object
        return { [options?.customID ?? config.id]: errorMessage };
    };

/**
 * Determine the value to evaluate the desired expression against. Can either be a fixed value or another value extracted from the form group
 * @param config
 * @param control
 * @returns
 */
const extractValue = <t>(compareValue: t | NtsForms.Config, control: AbstractControl) => {
    // If this is a config type with a compare value, get the dynamic field and then its value
    if (isConfig(compareValue)) {
        const c = control.root.get(compareValue.compareToField);
        // Can't find the control
        if (!c) {
            return null;
        }
        // Return the control's value
        return c.value;
    }
    // Not a config type, return the value
    return compareValue;
}