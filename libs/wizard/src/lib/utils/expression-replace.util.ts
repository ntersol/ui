import { getByPath } from './get-by-path.util';
import { FormGroup } from '@angular/forms';
import { applyPipeFormatting } from './apply-pipe-formatting.util';

/**
 *  Replace expressions from a model
 * @param str
 * @param form
 * @param indexes
 */
export const expressionReplacer = (model: FormGroup, str: string | null | undefined): string => {
  // Get model and array index values
  const modelSrc = model.getRawValue();

  return str && typeof str === 'string' && str.match(/[^{{\}\}]+(?=})/g)
    ? str
        // Get all mustache replacements
        .replace(/[^{{\}\}]+(?=})/g, (strNew) => {
          const pipes = strNew.split('|');
          // Remove first item in the array since its the value
          // All remaining items in the pipes array are ouoes
          strNew = pipes?.shift()?.trim() || '';
          // Get field value
          const result = getByPath(strNew, modelSrc);
          // Check if this is a nested value
          let value = result && result?.value ? result.value : result || '';
          // If pipes are present, apply pipe transformation
          if (pipes.length) {
            value = applyPipeFormatting(value, pipes);
          }
          return value || '';
        })
        // Cleanup anything left over
        .replace(/{{/gi, '')
        .replace(/}}/gi, '')
    : str || '';
};
