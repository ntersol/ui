import { NtsValidators } from '../validators.models';
import { baseValidator } from './_base.validators';

/**
 * Form value must have characters equal to
 * @param compareValue
 * @param options
 * @returns
 */
export const charsIsEqualToValidator = (
  compareValueSrc: number | NtsValidators.Config,
  options?: NtsValidators.Options,
) =>
  baseValidator(
    compareValueSrc,
    {
      id: 'charsIsEqualTo',
      evaluatorFn: (compareValue: number, formValue: unknown) =>
        (typeof formValue === 'string' || typeof formValue === 'number') && String(formValue).length === compareValue,
      errorMessageDefault: (compareValue: unknown) =>
        `Please enter exactly <strong>${compareValue} characters</strong>`,
    },
    options,
  );

/**
 * Form value must have characters greater than
 * @param charCount
 * @param options
 * @returns
 */
export const charsIsGreaterThanValidator = (
  compareValueSrc: number | NtsValidators.Config,
  options?: NtsValidators.Options,
) =>
  baseValidator(
    compareValueSrc,
    {
      id: 'charsIsGreaterThan',
      evaluatorFn: (compareValue: number, formValue: unknown) =>
        (typeof formValue === 'string' || typeof formValue === 'number') && String(formValue).length > compareValue,
      errorMessageDefault: (compareValue: unknown) =>
        `Please enter more than <strong>${compareValue} characters</strong>`,
    },
    options,
  );

/**
 * Form value must have characters less than
 * @param charCount
 * @param options
 * @returns
 *  */
export const charsIsLessThanValidator = (
  compareValueSrc: number | NtsValidators.Config,
  options?: NtsValidators.Options,
) =>
  baseValidator(
    compareValueSrc,
    {
      id: 'charsIsLessThan',
      evaluatorFn: (compareValue: number, formValue: unknown) =>
        (typeof formValue === 'string' || typeof formValue === 'number') && String(formValue).length < compareValue,
      errorMessageDefault: (compareValue: unknown) =>
        `Please enter less than <strong>${compareValue} characters</strong>`,
    },
    options,
  );
