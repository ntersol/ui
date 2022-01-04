import { required } from "./misc.validators";
import { isGreaterThan } from "./number.validators";

export const NtsValidators = {
    required: required,
    email: () => { },
    Date: {},
    Number: {
        isGreaterThan: isGreaterThan
    }
};