import { isEqualTo as isEqualToChars, isGreaterThan as isGreaterThanChars, isLessThan as isLessThanChars } from "./chars.validators";
import { email, required } from "./misc.validators";
import { isGreaterThan, isLessThan } from "./number.validators";

export const NtsValidators = {
    /** Set a control as required */
    required: required,
    /** Require a valid email address */
    email: email,
    /** Validations based on the characters  */
    Chars: {
        /**  Characters must be equal to */
        isEqualTo: isEqualToChars,
        /** Must have characters greater than */
        isGreaterThan: isGreaterThanChars,
        /** Must have characters less than */
        isLessThan: isLessThanChars,
    },
    Date: {},
    Number: {
        isGreaterThan: isGreaterThan,
        isLessThan: isLessThan,
    }
};