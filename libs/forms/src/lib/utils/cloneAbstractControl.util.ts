import { AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';

/**
 * Clone an existing abstract control
 * @param control
 */
export const cloneAbstractControl = (control: AbstractControl) => {
  let newControl: AbstractControl = new FormControl();

  if (control instanceof FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    const controls = control.controls;

    Object.keys(controls).forEach((key) => {
      formGroup.addControl(key, cloneAbstractControl(controls[key]));
    });

    newControl = formGroup;
  } else if (control instanceof FormArray) {
    const formArray = new FormArray([], control.validator, control.asyncValidator) as any;

    control.controls.forEach((formControl) => formArray.push(cloneAbstractControl(formControl)));

    newControl = formArray;
  } else if (control instanceof FormControl) {
    newControl = new FormControl(control.value, control.validator, control.asyncValidator);
  } else {
    console.error('Error: unexpected control value');
  }

  if (control.disabled) {
    newControl.disable({ emitEvent: false });
  }

  return newControl;
};
