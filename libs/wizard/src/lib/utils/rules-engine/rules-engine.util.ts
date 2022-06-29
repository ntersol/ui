import { FormGroup } from '@angular/forms';
import { NtsWizard } from '../../wizard.models';
import { ruleSet } from './rule-set.util';

/**
 *
 * @param ruleGroups
 * @param model
 * @param arrayIndexs
 */
export const rulesEngine = (model: FormGroup, ruleGroups: NtsWizard.RuleGroup[]): false | NtsWizard.RuleGroup => {
  // Get model and array index values
  const modelSrc = model.getRawValue();

  for (let i = 0; i < ruleGroups.length; i++) {
    // Get current group
    const groupCurrent = ruleGroups[i];
    let rulesMatch = false;

    // Check for rules
    if (groupCurrent.rules) {
      // Handle ruleset
      rulesMatch = ruleSet(groupCurrent.rules, modelSrc);
    }

    // Return match of rulegroup
    if (rulesMatch) {
      return groupCurrent;
    }
  }
  // No rulegroup matched
  return false;
};
