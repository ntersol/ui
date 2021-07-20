import { SelectItem } from 'primeng/api';

/**
 * Typeguards for form field types
 */
export const is = {
  selectItemArray: (val?: unknown | null): val is SelectItem[] => {
    if (val && Array.isArray(val) && ((typeof val[0] === 'object' && Object.prototype.isPrototypeOf.call(val[0], 'value'))
      || !val.length)) {
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
    if (val && typeof val === 'object' && !Array.isArray(val) && Object.prototype.isPrototypeOf.call(val, 'value')) {
      return true;
    }
    return false;
  },
};
