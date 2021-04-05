import { Wizard } from '../../wizard';
import { WizardOperator } from '../../wizard.enums';

/**
 *
 * @param rule
 * @param fieldValue
 */
export const ruleSingle = (rule: Wizard.Rule, fieldValue: any): boolean => {
  let value = fieldValue;
  // If field value is object or array, look at length
  if ((fieldValue && typeof fieldValue === 'object') || Array.isArray(fieldValue)) {
    value = fieldValue.length;
  }

  switch (rule.operator) {
    case WizardOperator.EQ:
      
      return value === rule.value ? true : false; //  || (value === null && rule.value === false) // Removed nulls matching against falses
    case WizardOperator.NE:
      return !(value === rule.value || (value === null && rule.value === false) ? true : false);
    case WizardOperator.GT:
      return parseInt(value) > parseInt(rule.value) ? true : false;
    case WizardOperator.GE:
      return parseInt(value) >= parseInt(rule.value) ? true : false;
    case WizardOperator.LT:
      return parseInt(value) < parseInt(rule.value) ? true : false;
    case WizardOperator.LE:
      return parseInt(value) <= parseInt(rule.value) ? true : false;
    case WizardOperator.IN: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return fieldValue.every(v => rule.value.includes(v));
      }
      return rule.value.includes(fieldValue);
    }
    case WizardOperator.NOT_IN: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return fieldValue.some(v => !rule.value.includes(v));
      }
      return !rule.value.includes(fieldValue);
    }
    case WizardOperator.INCLUDES: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return rule.value.every(v => fieldValue.includes(v));
      }
      return fieldValue !== null && fieldValue !== undefined &&  fieldValue.includes(rule.value);
    }
    case WizardOperator.NOT_INCLUDES: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return rule.value.some(v => !fieldValue.includes(v));
      }
      return fieldValue === null || !fieldValue.includes(rule.value);
    }
    case WizardOperator.INTERSECTS: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return rule.value.some(v => fieldValue.includes(v));
      }
      return false;
    }
    case WizardOperator.NOT_INTERSECTS: {
      if (fieldValue && Array.isArray(fieldValue) && rule.value && Array.isArray(rule.value)) {
        return rule.value.every(v => !fieldValue.includes(v));
      }
      return true;
    }
  }

  return false;
};
