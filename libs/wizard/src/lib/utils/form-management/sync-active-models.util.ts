import { FormGroup } from '@angular/forms';

/**
 * Patches data from the active form group back into the main form group.
 * Looks at the dirty flag to determine what needs to be patched back
 * @param form
 * @param formGroupActive
 */
export const syncActiveModels = (form: FormGroup, formGroupActive: FormGroup) => {
  // Loop through all the controls in the active form group
  Object.keys(formGroupActive.controls).forEach((key) => {
    // Get control
    const control = formGroupActive.controls[key];
    if (control.dirty) {
      // Get path of destination in the source form group
      const path = control.value.$$.src + '.' + control.value.$$.index;
      const controlSrc = form.get(path);
      // Patch data back in
      if (controlSrc) {
        controlSrc.patchValue(control.value);
        controlSrc.markAsDirty();
      }
      control.markAsPristine(); // Reset state
    }
  });
  formGroupActive.markAsPristine(); // Reset state
};
