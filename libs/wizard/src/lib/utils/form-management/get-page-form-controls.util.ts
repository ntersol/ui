import { FormControl } from '@angular/forms';
import { Wizard } from '../../wizard';

import { isType } from '../typeguards.util';

/**
 * Records a record of formcontrols from a pages content array but only ones that are visible
 * @param content
 */
export const getPageFormControls = (content: Wizard.Content[]): Record<string, FormControl> => {
  const controlsById: Record<string, FormControl> = {};
  // Get top level form controls
  (content.filter(c => c.visible && isType.formFieldControl(c)) as Wizard.FormFieldControl[]).forEach(c => (controlsById[c.field] = c.formControl));
  // Get form controls nested in side row > column > content
  (content.filter(c => isType.row(c)) as Wizard.Row[]).forEach(c => {
    c.columns.forEach(c2 => {
      (c2.content.filter(c3 => c3.visible && isType.formFieldControl(c3)) as Wizard.FormFieldControl[]).forEach(
        c4 => (controlsById[c4.field] = c4.formControl),
      );
    });
  });

  return controlsById;
};
