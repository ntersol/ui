import { Wizard } from '../../wizard.models';
import { getByPath } from '../get-by-path.util';
import { ruleSingle } from './rule.util';

/**
 *
 * @param rules
 * @param model
 * @param arrayIndexes
 */
export const ruleSet = (rules: Wizard.Rule[], model: any, arrayIndexes: any): boolean => {
  return rules.reduce((a, rule) => {
    const fieldValue = getByPath(rule.field, model, arrayIndexes);
    // Get result of this rule
    const result = ruleSingle(rule, fieldValue);
    return !result ? false : a;
  }, true as boolean);
};
