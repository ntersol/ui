import { FormArray, FormGroup, FormControl } from '@angular/forms';

/**
 * Automatically generate a form group complete with controls from JSON or a JS object. Will recurse through nested objects/arrays.
 * @param model - An object or JSON of the model. Can contain nested objects and arrays
 */
export const jsonToFormGroup = (model: any) => {
  // console.log('jsonToFormGroup', model);
  const formModel: any = {};
  // Loop through all props in the model
  Object.keys(model).forEach(key => {
    // Delete props from loan modal that cause saving to fail

    // If this is a nested object, recurse to create form group
    if (model[key] && typeof model[key] === 'object' && !Array.isArray(model[key])) {
      formModel[key] = jsonToFormGroup(model[key]);
    } else if (model[key] && typeof model[key] === 'object' && Array.isArray(model[key])) {
      // If this is an array, recurse to create a form array
      const formArray: any[] = [];
      model[key].forEach((item: any) => formArray.push(jsonToFormGroup(item)));
      formModel[key] = new FormArray(formArray);
    } else {
      // Standard value
      formModel[key] = [null, []];
    }
  });

  // If iterating inside an array of primitives, return a form control for the primitive
  if (typeof model === 'string' || typeof model === 'number' || typeof model === 'boolean') {
    return new FormControl('');
  }

  return new FormGroup(formModel);
};
