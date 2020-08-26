import { FormControl, FormArray } from '@angular/forms';





export const isType = {


  formArray: (control?: FormControl | FormArray | null): control is FormArray => !!control && Array.isArray(control.value),


};


