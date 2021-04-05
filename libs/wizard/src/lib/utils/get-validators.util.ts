import { Wizard } from '../wizard';
import { Validators, ValidatorFn } from '@angular/forms';

/**
 * Create the array of validators required by a form control
 * @param validators
 */
export const getValidators = (validators: Wizard.FieldValidator | undefined | null = {}) => {
  const validatorsResult: ValidatorFn[] = [];
  if (!validators) {
    validators = {};
  }
  if (validators.required !== false) {
    // validatorsResult.push(Validators.required);
  }
  if (validators.email) {
    validatorsResult.push(Validators.email);
  }
  if (validators.minLength) {
    validatorsResult.push(Validators.minLength(validators.minLength));
  }
  if (validators.maxLength) {
    validatorsResult.push(Validators.maxLength(validators.maxLength));
  }
  if (validators.min) {
    validatorsResult.push(Validators.min(validators.min));
  }
  if (validators.max) {
    validatorsResult.push(Validators.max(validators.max));
  }
  if (validators.custom && validators.custom.length) {
    validators.custom.forEach(validator => validatorsResult.push(validator));
  }

  return validatorsResult;
};
