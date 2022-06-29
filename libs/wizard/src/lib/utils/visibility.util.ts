import { FormGroup } from '@angular/forms';
import { rulesEngine } from '.';
import { NtsWizard } from '../wizard.models';
import { isType } from './typeguards.util';

/**
 * Manage the visibility of a control or element
 * @param src
 * @param form
 * @param indexLoop
 * @returns
 */
export const isVisible = (src?: NtsWizard.Content | NtsWizard.Button, form?: FormGroup, indexLoop?: number) => {
  if (!src || !form) {
    return true;
  }
  // Support a string that gets a form control that returns a truthy or falsey value
  if (typeof src.visible === 'string') {
    // If first char is an exclamation point
    const v = src.visible.charAt(0) === '!';
    const c = v ? form.get(src.visible.slice(1)) : form.get(src.visible);
    const value = !!c?.value ? true : false;
    // If not, reverse value
    return v ? !value : value;
  }

  // Add array indexes to loop if specified
  if (Array.isArray(src.visible)) {
    src.visible.forEach(a => {
      a.rules.forEach(r => {
        if (r.useIndex) {
          r.value = indexLoop;
        }
      });
    });
  }
  return isType.ruleGroup(src.visible) ? rulesEngine(form, src.visible) : src.visible === false ? false : true;
};
