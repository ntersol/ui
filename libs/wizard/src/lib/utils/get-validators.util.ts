import { NtsWizard } from '../wizard.models';
import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * Create the array of validators required by a form control
 * @param validators
 */
export const getValidators = (validators: NtsWizard.FieldValidator | undefined | null = {}) => {
  const validatorsResult: ValidatorFn[] = [];
  if (!validators) {
    validators = {};
  }
  if (validators.required === true) {
    validatorsResult.push(Validators.required);
  }
  if (validators.email) {
    // Custom email validator. Angular's default one supports a lot of non-standard usages that clients never want
    validatorsResult.push((control: AbstractControl) => {
      const value = control.value;
      const pattern = /\S+@\S+\.\S+/;
      return pattern.test(value) ? null : { email: true };
    });
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
    console.error('<WIZARD> Add support for custom field validators');
    // validators.custom.forEach(validator => validatorsResult.push(validator));
  }

  return validatorsResult;
};
