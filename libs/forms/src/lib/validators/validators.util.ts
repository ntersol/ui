import { async } from "./src/async.validators";
import { email, required } from "./src/misc.validators";
import { charsIsEqualTo } from "./src/chars.validators";
import { numberIsLessThan } from "./src/number.validators";

/**
 * TODO: Not tree shakable
 */
export const NtsValidators = {
    /** Set a control as required */
    required: required,
    /** Require a valid email address */
    email: email,
    /** Create an async validator */
    async: async,
    /** Validations based on the characters  */
    Chars: {
        /**  Characters must be equal to */
        isEqualTo: charsIsEqualTo,
        /** Must have characters greater than */
        // isGreaterThan: charsIsGreaterThan,
        /** Must have characters less than */
        //  isLessThan: charsIsLessThan,
    },
    Date: {},
    Number: {
        //   isGreaterThan: numberIsGreaterThan,
        isLessThan: numberIsLessThan,
    }
};