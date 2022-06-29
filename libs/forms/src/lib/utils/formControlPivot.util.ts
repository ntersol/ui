import { FormGroup, FormArray } from '@angular/forms';

import { jsonToFormGroup } from './jsonToFormGroup.util';

export const formControlPivot = (formGroup: FormGroup, srcPath: string, desPath: string, srcId: string, destId: string) => (index = 0) => {
  // console.log(formGroup, srcPath, desPath, srcId, destId);

  const srcArray = formGroup.get(srcPath) as FormArray;

  const destPath = formGroup.get(desPath) as FormArray;

  if (!srcArray || !destPath) {
    return;
  }

  // console.log(srcArray.value, destPath.value);

  // Convert the destination array to a record using the primary key from the src array

  const destRecord: Record<string, any> = {};

  destPath.value.forEach((e: any) => (destRecord[e[destId]] = e));

  const srcKey = srcArray.value[index][srcId];

  if (destRecord[srcKey]) {
    const pivotFormGroup = jsonToFormGroup(destRecord[srcKey]);

    pivotFormGroup.patchValue(destRecord[srcKey]);

    // console.log(pivotFormGroup);

    return pivotFormGroup;
  }

  // Create a new form group based on the pivot

  // pivotFormGroup.valueChanges.pipe().subscribe(v => destPath.at())

  return null;
};
