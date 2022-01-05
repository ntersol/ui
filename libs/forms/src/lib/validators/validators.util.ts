import { isEqualTo } from "./chars.validators";
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
        isEqualTo: isEqualTo
    },
    Date: {},
    Number: {
        isGreaterThan: isGreaterThan,
        isLessThan: isLessThan
    }
};