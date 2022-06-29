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
 export const isDisabled = (src?: NtsWizard.Content | NtsWizard.Button, form?: FormGroup, indexLoop?: number) => {
  if (!src || !form || src.disabled === undefined || src.disabled === null) {
    return false;
  }
  // Support a string that gets a form control that returns a truthy or falsey value
  if (typeof src.disabled === 'string') {
    // If first char is an exclamation point
    const v = src.disabled.charAt(0) === '!';
    const c = v ? form.get(src.disabled.slice(1)) : form.get(src.disabled);
    const value = !!c?.value ? true : false;
    // If not, reverse value
    return v ? !value : value;
  }

  // Add array indexes to loop if specified
  if (Array.isArray(src.disabled)) {
    src.disabled.forEach(a => {
      a.rules.forEach(r => {
        if (r.useIndex) {
          r.value = indexLoop;
        }
      });
    });
  }
  return isType.ruleGroup(src.disabled) ? rulesEngine(form, src.disabled) : src.disabled === false ? false : true;
};