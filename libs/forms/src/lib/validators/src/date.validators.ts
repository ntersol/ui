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
            // Get date to compare against and apply the date transforms
            let today = dayjs();
            // Get date in form entered by user
            const formDate = dayjs(formValue);
            if (!isValidDate(compareValue) && compareValue.years) {
                today = today.subtract(compareValue.years, 'year');
            }
            if (!isValidDate(compareValue) && compareValue.months) {
                today = today.subtract(compareValue.months, 'month');
            }
            if (!isValidDate(compareValue) && compareValue.days) {
                today = today.subtract(compareValue.days, 'day');
            }
            // Get date if dynamically supplied, today otherwise
            const compareDate = isValidDate(compareValue) ? dayjs(compareValue) : today;

            // Make sure the date is valid, if not throw error
            if (!formDate.isValid() || !compareDate.isValid()) {
                return { 'dateIsGreaterThan': 'Date is <strong>invalid</strong>' };
            }
            // If date is greater than duration
            return !!compareDate.isAfter(formDate);
        },
        errorMessageDefault: compareValue => {
            if (!isValidDate(compareValue) && !!compareValue.years) {
                return `Please enter a date that is over <strong>${compareValue.years}</strong> years old`;
            } else if (!isValidDate(compareValue) && !!compareValue.months) {
                return `Please enter a date that is over <strong>${compareValue.months}</strong> months old`;
            } else if (!isValidDate(compareValue) && !!compareValue.days) {
                return `Please enter a date that is over <strong>${compareValue.days}</strong> days old`;
            }

            return `Please enter a valid date`;
        }
    }, options);