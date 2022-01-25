import { NtsForms } from "../../forms.models";
import { baseValidator } from "./_base.validators";

/**
 * Form value must have characters equal to
 * @param compareValue
 * @param options
 * @returns
 */
export const charsIsEqualTo = (compareValueSrc: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator(
    compareValueSrc,
    {
        id: 'charsIsEqualTo',
        evaluatorFn: (compareValue, formValue) => (typeof compareValue === 'string' || typeof compareValue === 'number') && String(compareValue).length === formValue,
        errorMessageDefault: compareValue => `Please enter exactly <strong>${compareValue} characters</strong>`
    }, options);

/**
 * Form value must have characters greater than
 * @param charCount
 * @param options
 * @returns

export const charsIsGreaterThan = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator({
    id: 'charsIsGreaterThan',
    value: charCount,
    evaluatorFn: (formValue, compareValue) => (typeof formValue === 'string' || typeof formValue === 'number') && String(formValue).length > compareValue,
    errorMessageDefault: desiredValue => `Please enter more than <strong>${desiredValue} characters</strong>`
}, options);
 */
/**
 * Form value must have characters less than
 * @param charCount
 * @param options
 * @returns

export const charsIsLessThan = (charCount: number | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator({
    id: 'charsIsLessThan',
    value: charCount,
    evaluatorFn: (formValue, compareValue) => (typeof formValue === 'string' || typeof formValue === 'number') && String(formValue).length < compareValue,
    errorMessageDefault: compareValue => `Please enter less than <strong>${compareValue} characters</strong>`
}, options);
 */