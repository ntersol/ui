import { NtsWizard } from '../wizard.models';

/**
 *
 * @param src
 * @param replacements
 * @returns
 */
export const variableReplacement = <t>(src: t, replacements: NtsWizard.VariableReplacement[]): t =>
  JSON.parse(JSON.stringify(src), (_key, value) => {
    // Only check against strings
    if (typeof value === 'string') {
      // Loop through the available replacement values
      for (let index = 0; index < replacements.length; index++) {
        const element = replacements[index];
        // If the string is an exact match, return the data structure directly
        // This allows the conversion of a string to a non-string type like a date
        if (value === element.var) {
          return element.replaceWith;
        }
        // If the replacement var is found anywhere in string, replace it
        else if (value.includes(element.var)) {
          const regex = new RegExp(element.var, 'g');
          return value.replace(regex, element.replaceWith); // element.replaceWith;
        }
      }
    }
    // Nothing else found, return same ol value
    return value;
  });
