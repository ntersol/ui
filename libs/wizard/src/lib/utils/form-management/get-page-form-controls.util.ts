import { FormControl } from '@angular/forms';
import { NtsWizard } from '../../wizard.models';

import { isType } from '../typeguards.util';

/**
 * Records a record of formcontrols from a pages content array but only ones that are visible
 * @param content
 */
export const getPageFormControls = (content: NtsWizard.Content[]): Record<string, FormControl> => {
  const controlsById: Record<string, FormControl> = {};

  // Get top level form controls
  // Must be visible, a form field and not disabled
  (content.filter(c => c.visible && isType.formFieldControl(c) && !c.formControl.disabled) as NtsWizard.FormFieldControl[]).forEach(
    c => (controlsById[c.field] = c.formControl),
  );

  // Get form controls nested in side row > column > content
  (content.filter(c => isType.row(c)) as NtsWizard.Row[])
    .filter(r => r.visible)
    .forEach(c => {
      c.columns.forEach(c2 => {
        (c2.content.filter(
          // Must be visible, a form field and not disabled
          c3 => c3.visible && isType.formFieldControl(c3) && !c3.formControl.disabled,
        ) as NtsWizard.FormFieldControl[]).forEach(c4 => (controlsById[c4.field] = c4.formControl));
      });
    });

  return controlsById;
};
