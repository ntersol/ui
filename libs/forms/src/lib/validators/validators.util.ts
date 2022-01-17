import { async } from "./src/async.validators";
import { isEqualTo as isEqualToChars, isGreaterThan as isGreaterThanChars, isLessThan as isLessThanChars } from "./src/chars.validators";
import { email, required } from "./src/misc.validators";
import { isGreaterThan, isLessThan } from "./src/number.validators";

export const NtsValidators = {
    /** Set a control as required */
    required: required,
    /** Require a valid email address */
    email: email,

    async: async,
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