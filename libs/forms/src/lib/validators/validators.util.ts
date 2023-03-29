import { emailValidator, requiredValidator } from './src/misc.validators';
import { FormControl } from '@angular/forms';
import { NtsForms } from '../forms.model';

/**
 * Dynamically attach validators to a form control. Will check for existing control first
 * @param formControl
 * @param validators
 */
export const validatorsAdd = (formControl?: FormControl, validators?: NtsForms.Validators) => {
  if (!formControl || !validators) {
    return;
  }
  // Ensure type safety
  const keys = Object.keys(validators) as Array<keyof typeof validators>;
  // Loop through keys, attach typesafe validators
  // Only add if validator hasn't already been added
  keys.forEach((key) => {
    if (key === 'required' && !formControl.hasValidator(requiredValidator)) {
      formControl.addValidators(requiredValidator);
    }
    if (key === 'email' && !formControl.hasValidator(emailValidator)) {
      formControl.addValidators(emailValidator);
    }
  });
};

/**
 * TODO: Not tree shakable
 */
// export const NtsValidators = {
//   /** Set a control as required */
//   required: required,
//   /** Require a valid email address */
//   email: email,
//   /** Create an async validator */
//   async: async,
//   /** Validations based on the characters  */
//   Chars: {
//     /**  Characters must be equal to */
//     isEqualTo: charsIsEqualTo,
//     /** Must have characters greater than */
//     // isGreaterThan: charsIsGreaterThan,
//     /** Must have characters less than */
//     //  isLessThan: charsIsLessThan,
//   },
//   Date: {},
//   Number: {
//     //   isGreaterThan: numberIsGreaterThan,
//     isLessThan: numberIsLessThan,
//   },
// };
