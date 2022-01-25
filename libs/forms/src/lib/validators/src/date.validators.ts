import { NtsForms } from "../../forms.models";
import { baseValidator } from "./_base.validators";
import * as dayjs from 'dayjs'

/**
 * Check if date is correct type and is valid
 * @param date
 * @returns
 */
const isValidDate = (date: any): date is Date => date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date)

/**
 * Handle date conversion
 * @param value
 * @returns

const dateConvert = (value: any) => {
    if (typeof value === 'string' && isValidDate(new Date(value))) {
        return new Date(value);
    } else if (isValidDate(value)) {
        return value as Date;
    }
    return null;
}
 */

/**
 * Form value must have characters greater than
 * @param charCount
 * @param options
 * @returns
 */
export const dateIsGreaterThan = (compareValueSrc: NtsForms.DateOption | Date | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator(
    compareValueSrc,
    {
        id: 'dateIsGreaterThan',
        evaluatorFn: (compareValue, formValue) => {
            const compareDate = isValidDate(compareValue) ? dayjs(compareValue) : dayjs().add(7, 'year');
            const formDate = dayjs(formValue);
            console.log(compareDate, formDate)
            if (!formDate.isValid() || !compareDate.isValid()) {
                return { 'dateIsGreaterThan': 'Date is invalid' };
            }

            if (!isValidDate(compareValue)) {
                compareValue
            }

            return true;
        },
        errorMessageDefault: compareValue => `Please enter less than <strong>${compareValue} characters</strong>`
    }, options);

