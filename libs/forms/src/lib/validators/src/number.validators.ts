import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NtsForms } from "../../forms.models";
import { isRequired } from "./misc.validators";
import { baseValidator } from "./_base.validators";

/**
 * Number value must be greater than
 * @param compareValue
 * @param options
 * @returns
 */
export const numberIsGreaterThan = (compareValueSrc: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator(
    compareValueSrc,
    {
        id: 'numberIsGreaterThan',
        evaluatorFn: (compareValue, formValue) => (typeof formValue === 'number' && formValue > compareValue) || (typeof formValue === 'string' && parseInt(formValue) > compareValue),
        errorMessageDefault: compareValue => `Please enter a number <strong>greater than ${compareValue}</strong>`
    }, options);

/**
 * Number value must be less than
 * @param compareValue
 * @param options
 * @returns
 */
export const numberIsLessThan = (compareValueSrc: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator(
    compareValueSrc,
    {
        id: 'numberIsLessThan',
        evaluatorFn: (compareValue, formValue) => (typeof formValue === 'number' && formValue > compareValue) || (typeof formValue === 'string' && parseInt(formValue) < compareValue),
        errorMessageDefault: compareValue => `Please enter a number <strong>less than ${compareValue}</strong>`
    }, options);
