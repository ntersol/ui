import { cloneDeep } from 'lodash';

/**
 * Convert array to record using unique Id
 * @param arr
 * @param uniqueId
 */
export const arrayToRecord = <t extends object>(array: any[], keyField: string): Record<string, t> =>
  array.reduce((obj, e) => {
    obj[e[keyField]] = e;
    return obj;
  }, {});

// getKeyValue<keyof User, User>("name")(user);
export const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

/** Typesafe version of clone deep */
export const clone = <t>(e: t): t => cloneDeep(e);
