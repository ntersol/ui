import { FormGroup } from '@angular/forms';
import { jsonToFormGroup } from '../../../forms/utils/jsonToFormGroup.util';

export const createActiveFormGroup = (form: FormGroup): FormGroup => {
  const formValue = form.getRawValue();
  const output: Record<string, any> = {};
  Object.keys(formValue).forEach((key) => {
    const entity: any[] | Record<string | number, any> = formValue[key];
    if (Array.isArray(entity)) {
      output[key] = {
        ...entity[0],
        $$: {
          index: 0,
          src: key,
        },
      };
    }
  });
  const formGroup = jsonToFormGroup(output) as FormGroup;
  formGroup.patchValue(output);
  return formGroup;
};
