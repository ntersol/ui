import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { isType } from '../typeguards.util';

/**
 * Return a form control from a formgroup. Create the tree within the formgroup if it does not exist
 * @param form
 * @param path
 * @param isFormArray Should the final property in the string be an array
 */
export const getOrCreateFormControl =
  (form: FormGroup) =>
  (path: string, isFormArray = false): FormControl => {
    // Get the path and split
    const pathSplit = path.split('.');

    const pathHistory: string[] = [];

    // Loop through the path segments
    for (let index = 0; index < pathSplit.length; index++) {
      const pathCurrent = pathSplit[index];
      pathHistory.push(pathCurrent);

      // Get control
      const control = form.get(pathHistory.join('.'));

      // If control does not exist, create it
      if (!control) {
        const parentPath = [...pathHistory];
        parentPath.length = parentPath.length - 1;
        const controlCurrentType = pathHistory[pathHistory.length - 1]; // Get path of current type
        const controlNextType = pathSplit[index + 1]; // Get path of NEXT type
        // If the next item in the path is a number then we need to create a form array
        if (isType.number(controlNextType)) {
          const parentControl = form.get(parentPath.join('.')) as FormGroup;
          parentControl.addControl(pathCurrent, new FormArray([]));
          // If current control is a NUMBER then this is an array. Add a new nested form group
        } else if (isType.number(controlCurrentType)) {
          const parentControl = form.get(parentPath.join('.')) as FormArray;
          parentControl.push(new FormGroup({}));
          // If this is the last step in the path then the final destination should be a form control
        } else if (pathHistory.length === pathSplit.length) {
          const parentControl = form.get(parentPath.join('.')) as FormGroup;
          if (isFormArray) {
            parentControl.addControl(pathCurrent, new FormArray([]));
          } else {
            parentControl.addControl(pathCurrent, new FormControl(null, []));
          }

          // If not a final path or a form array this this is a nested object
        } else {
          const parentControl = form.get(parentPath.join('.')) as FormGroup;
          parentControl.addControl(pathCurrent, new FormGroup({}));
        }
      }
    }
    // Return form control
    return form.get(pathSplit.join('.')) as FormControl;
  };
