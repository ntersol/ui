import { FormArray, FormGroup, FormControl } from '@angular/forms';

/**
 * Automatically generate a form group complete with controls from JSON or a JS object. Will recurse through nested objects/arrays.
 * @param model - An object or JSON of the model. Can contain nested objects and arrays
 */
export const jsonToFormGroup = (model: any): FormGroup | FormControl => {
  const formModel: any = {};
  // Iterate through all props in model
  Object.keys(model).forEach(key => {
    // Recurse if object
    if (model[key] && typeof model[key] === 'object' && !Array.isArray(model[key])) {
      formModel[key] = jsonToFormGroup(model[key]);
    } else if (model[key] && typeof model[key] === 'object' && Array.isArray(model[key])) {
      // Form array, recurse
      const formArray: any[] = [];
      model[key].forEach((e: any) => formArray.push(jsonToFormGroup(e)));
      formModel[key] = new FormArray(formArray);
    } else {
      // Normal value
      formModel[key] = new FormControl(null);
    }
  });

  // If inside an array of primitives, create form control
  if (typeof model === 'string' || typeof model === 'number' || typeof model === 'boolean') {
    return new FormControl(null);
  }
  return new FormGroup(formModel);
};
