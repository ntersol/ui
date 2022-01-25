import { NtsForms } from "../../forms.models";
import { baseValidator } from "./_base.validators";
import * as dayjs from 'dayjs'



/**
 * Form value must have characters greater than
 * @param charCount
 * @param options
 * @returns

export const dateIsGreaterThan = (date: NtsForms.DateOption | NtsForms.Config, options?: NtsForms.ValidatorOptions) => baseValidator({
    id: 'dateIsGreaterThan',
    value: date as any,
    evaluatorFn: (formValue, compareValue) => {
        const today = dayjs()
        console.log(formValue, compareValue)
        return true;

    },
    errorMessageDefault: desiredValue => `Please enter more than <strong>${desiredValue} characters</strong>`
}, options);
 */