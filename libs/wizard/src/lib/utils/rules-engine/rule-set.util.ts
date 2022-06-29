import { NtsWizard } from '../../wizard.models';
import { getByPath } from '../get-by-path.util';
import { ruleSingle } from './rule.util';

/**
 *
 * @param rules
 * @param model
 * @param arrayIndexes
 */
export const ruleSet = (rules: NtsWizard.Rule[], model: any): boolean => {
  return rules.reduce((a, rule) => {
    const fieldValue = getByPath(rule.field, model);
    // Get result of this rule
    const result = ruleSingle(rule, fieldValue);
    return !result ? false : a;
  }, true as boolean);
};
