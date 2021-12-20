import { getByPath } from './get-by-path.util';
import { FormGroup } from '@angular/forms';

/**
 *  Replace expressions from a model
 * @param str
 * @param form
 * @param indexes
 */
export const expressionReplacer = (model: FormGroup, arrayIndexes: FormGroup) => (
  str: string | null | undefined,
): string => {
  // Get model and array index values
  const modelSrc = model.getRawValue();
  const arrayIndexesSrc = arrayIndexes.getRawValue();

  return str && typeof str === 'string' && str.match(/[^{{\}\}]+(?=})/g)
    ? str
        // Get all mustache replacements
        .replace(/[^{{\}\}]+(?=})/g, (strNew) => {
          // Get field value
          const result = getByPath(strNew, modelSrc, arrayIndexesSrc);
          // Only return if value is present
          if (result && result.value) {
            return result.value;
          } else if (result !== null && result !== undefined) {
            return result;
          }
          return '';
        })
        // Cleanup anything left over
        .replace(/{{/gi, '')
        .replace(/}}/gi, '')
    : str || '';
};
