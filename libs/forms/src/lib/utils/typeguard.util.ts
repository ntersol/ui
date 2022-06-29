import { FormArray } from '@angular/forms';

export const isType = {
  formArray: (control?: any | null): control is FormArray => !!control && Array.isArray(control.value),
};
