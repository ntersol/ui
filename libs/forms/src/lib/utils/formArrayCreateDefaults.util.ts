import { FormArray } from '@angular/forms';
import { isType } from './typeguard.util';
/**
 * If the controls in a form array do not match the available options input, create controls to match
 * TODO: Support object arrays not just string arrays
 * @param formArray
 * @param defaults
 */
export const formArrayCreateDefaults = (formArray: FormArray, defaults: unknown[]) => {
  if (isType.formArray(formArray) && formArray.length < defaults.length) {
    /**
    formArray.controls.forEach((_c, i) => {
      if (isType.formArray(formArray)) {
        formArray.removeAt(i);
      }
    });
    if (Array.isArray(defaults)) {
      defaults.forEach((m, i) => {
        if (isType.formArray(formArray)) {
          formArray.setControl(i, new FormControl(m.value));
        }
      });
    }
    */
  }
};
