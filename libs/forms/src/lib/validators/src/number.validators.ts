import { NtsValidators } from '../validators.models';
import { baseValidator } from './_base.validators';

/**
 * Number value must be greater than
 * @param compareValue
 * @param options
 * @returns
 */
export const numberIsGreaterThan = (compareValueSrc: number | NtsValidators.Config, options?: NtsValidators.Options) =>
  baseValidator(
    compareValueSrc,
    {
      id: 'numberIsGreaterThan',
      evaluatorFn: (compareValue: unknown, formValue: unknown) =>
        (typeof formValue === 'number' && typeof compareValue === 'number' && formValue > compareValue) ||
        (typeof formValue === 'string' &&
          typeof compareValue === 'string' &&
          parseInt(formValue) > parseInt(compareValue)),
      errorMessageDefault: (compareValue: unknown) =>
        `Please enter a number <strong>greater than ${compareValue}</strong>`,
    },
    options,
  );

/**
 * Number value must be less than
 * @param compareValue
 * @param options
 * @returns
 */
export const numberIsLessThan = (compareValueSrc: number | NtsValidators.Config, options?: NtsValidators.Options) =>
  baseValidator(
    compareValueSrc,
    {
      id: 'numberIsLessThan',
      evaluatorFn: (compareValue: unknown, formValue: unknown) =>
        (typeof formValue === 'number' && typeof compareValue === 'number' && formValue > compareValue) ||
        (typeof formValue === 'string' &&
          typeof compareValue === 'string' &&
          parseInt(formValue) < parseInt(compareValue)),
      errorMessageDefault: (compareValue: unknown) =>
        `Please enter a number <strong>less than ${compareValue}</strong>`,
    },
    options,
  );
