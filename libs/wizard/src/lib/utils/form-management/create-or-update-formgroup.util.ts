import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { NtsWizard } from '../..';
import { cloneAbstractControl, jsonToFormGroup } from '@ntersol/forms';
import { isFormControlGroupValid } from '../get-content.util';
import { isType } from '../typeguards.util';

/**
 * Add or update an entity in a form array
 * @param formGroup
 * @param a
 * @returns
 */
export const arrayUpsertItem = (
  formGroup?: FormGroup,
  a?: NtsWizard.ActionArrayUpsertItem,
  r?: Record<string, NtsWizard.FormFieldControl>,
): boolean | null => {
  if (!formGroup || !a) {
    return null;
  }
  const source = formGroup.get(a.fieldFrom);
  const dest = formGroup.get(a.fieldTo);
  if (!source) {
    console.error('<Wizard> Unable to found a source control for', a.fieldFrom);
    return null;
  }
  if (!dest) {
    console.error('<Wizard> Unable to found a destination control for', a.fieldTo);
    return null;
  }

  // If do not validate is NOT set, run validation before performing upsert
  if (!a.doNotValidate && !!r) {
    // Mark all as touch and patch value to update dom
    source.markAllAsTouched();
    source.patchValue(source.value);
    if (
      // If form control record exists and is invalid
      (!!r && !isFormControlGroupValid(r)) ||
      // Form control record does not exist and source is invalid
      (!r && source.invalid)
    ) {
      return false;
    }

    /**
    // isFormControlGroupValid(r)
    // If invalid, return false
    if (source.invalid || true) {
      return false;
    } */
  }

  // If destination is a form array
  if (isType.formArray(dest)) {
    createOrUpdateFormGroup(dest, source, a.uniqueID);
    if (!a.doNotReset) {
      source.reset();
    }
  } else {
    // TODO: Add condition for formgroups
    console.error('<Wizard> No condition exists for a destination that is not a form array');
  }

  dest.markAsUntouched();
  // Ensure any other conditions in the stack happen first
  setTimeout(() => {
    source.markAsUntouched();
    source.setErrors(null);
  });
  return true;
};

/**
 *
 * @param arr
 * @param fg
 */
export const createOrUpdateFormGroup = (arr: FormArray, fg: FormGroup | AbstractControl, uniqueID: string) => {
  const arrValue: any[] = arr.value;
  const fgValue = fg.value;
  let control: AbstractControl | null = cloneAbstractControl(fg);
  // Keep track if any matches have been found
  let createNew = true;
  // If the array is not empty
  arrValue.forEach((v, i) => {
    // If unique ID's match
    if (v[uniqueID] !== undefined && fgValue[uniqueID] !== undefined && v[uniqueID] === fgValue[uniqueID]) {
      control = arr?.get(String(i)); // Update control reference to the match in the array
      createNew = false; // Set create new to false
    }
  });

  // Add in data and mark as touched
  control.patchValue(fgValue);

  // If the form array is empty, or the model does not have a uniqueID
  // Add the new control to the end of the array
  // If no match was found, add to array
  if (createNew || !arrValue.length || !fgValue[uniqueID]) {
    arr.push(control);
  }

  // Mark control and ancestors as dirty
  control.markAsDirty();
  arr.markAsDirty();
  // If formgroup
  if (isType.formGroup(control)) {
    // Setting dirty on a formgroup does not impact it's child controls. Since this is a new control set dirty on all props
    Object.keys(control.controls).forEach((key) => control?.get(key)?.markAsDirty());
  }
};

/**
 * Delete an item from a form array
 * @param field
 * @param index
 * @param confirmFirst
 * @returns
 */
export const arrayDeleteItem = (
  formGroup?: FormGroup | AbstractControl,
  a?: NtsWizard.ActionArrayDeleteItem,
): boolean | null => {
  if (!formGroup || !a) {
    return null;
  }
  // Perform confirm check if requested
  const confirmCheck = a.confirm
    ? confirm(typeof a.confirm === 'string' ? a.confirm : 'Are you sure you want to delete this item?')
    : true;

  // User clicked cancel to confirm check
  if (!confirmCheck) {
    return null;
  }
  // Get the form array
  const formArray = formGroup?.get(a.field);
  if (!formArray || !isType.formArray(formArray)) {
    console.error('<Wizard> Delete action was not able to find a form array at this field: ', a.field);
    return null;
  }

  const itemToDelete = formArray.at(parseInt(String(a.index))) as FormGroup;
  if (!itemToDelete?.get('$$deleted')) {
    itemToDelete?.addControl('$$deleted', new FormControl(true));
  }
  // Once controls have been added, mark as dirty and touched
  itemToDelete?.get('$$deleted')?.markAllAsTouched();
  itemToDelete?.get('$$deleted')?.markAsDirty();
  return true;
};

/**
 * Create a model to a form array
 * TODO: This FN does not work reliably, creation is not consistent
 * @param field
 * @param model
 */
export const createItem = (formGroup?: FormGroup | AbstractControl, a?: NtsWizard.ActionArrayCreateItem) => {
  if (!formGroup || !a) {
    return;
  }
  // Check if control already exists
  const control = formGroup?.get(a.fieldTo);
  if (!control) {
    // Split field to get path
    const split = a.fieldTo.split('.');
    // Loop through paths
    split.forEach((s, i) => {
      const control = formGroup?.get(s) as FormGroup;
      // If control does not exist
      if (!control) {
        // Check if this is the last path in the field, if so add the model instead of a form group
        const fg2Add = split.length - 1 === i ? jsonToFormGroup(a.model) : new FormGroup({});
        if (!a.skipPatchData) {
          fg2Add.patchValue(a.model);
        }
        (formGroup as FormGroup)?.addControl(s, fg2Add);
        // Update formgroup ref to new nested control
        formGroup = formGroup?.get(s) as FormGroup;
      }
    });
  } else {
    // If control already exists
    if (!a.skipPatchData) {
      control.patchValue(a.model);
    }
  }
};

/**
 *  Copy a model from one location in the form group to another location
 * @param fieldTo
 * @param fieldFrom
 */
export const copyItem = (formGroup?: FormGroup | AbstractControl, a?: NtsWizard.ActionCopyItem) => {
  if (!formGroup || !a) {
    return;
  }
  const source = formGroup.get(a.fieldFrom);
  const dest = formGroup.get(a.fieldTo);
  if (!source) {
    console.error('<Wizard> Unable to found a source control for', a.fieldFrom);
    return;
  }
  if (!dest) {
    console.error('<Wizard> Unable to found a destination control for', a.fieldTo);
    return;
  }
  // Clear out any previous values in the destination
  dest.reset();
  // Source is array, destination is group
  if (isType.formArray(source) && !isType.formArray(dest) && a.index !== undefined) {
    const srcControl = source.at(parseInt(String(a.index)));
    dest.patchValue(srcControl.value);
    source.markAsDirty();
  } else {
    dest.patchValue(source.value);
  }
  dest.markAsDirty();
};
