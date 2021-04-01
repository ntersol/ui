import { SelectItem } from 'primeng/api';

/**
 * Typeguards for form field types
 */
export const is = {
  selectItemArray: (val?: unknown | null): val is SelectItem[] => {
    if (val && Array.isArray(val) && ((typeof val[0] === 'object' && val[0].hasOwnProperty('value')) || !val.length)) {
      return true;
    }
    return false;
  },
  /**
   * Is this value a SelectItem
   * @param val
   * @returns
   */
  selectItem: (val?: unknown | null): val is SelectItem => {
    if (val && typeof val === 'object' && !Array.isArray(val) && val.hasOwnProperty('value')) {
      return true;
    }
    return false;
  },
};
