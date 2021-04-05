import { FormGroup } from '@angular/forms';
import { Wizard } from '../../wizard';
import { ruleSet } from './rule-set.util';

/**
 *
 * @param ruleGroups
 * @param model
 * @param arrayIndexs
 */
export const rulesEngine = (model: FormGroup, arrayIndexes: FormGroup) => (ruleGroups: Wizard.RuleGroup[]): false | Wizard.RuleGroup => {
  // Get model and array index values
  const modelSrc = model.getRawValue();
  const arrayIndexesSrc = arrayIndexes.getRawValue();

  for (let i = 0; i < ruleGroups.length; i++) {
    // Get current group
    const groupCurrent = ruleGroups[i];
    let rulesMatch = false;

    // Check for rules
    if (groupCurrent.rules) {
      // Handle ruleset
      rulesMatch = ruleSet(groupCurrent.rules, modelSrc, arrayIndexesSrc);
    }

    // Return match of rulegroup
    if (rulesMatch) {
      return groupCurrent;
    }
  }
  // No rulegroup matched
  return false;
};
