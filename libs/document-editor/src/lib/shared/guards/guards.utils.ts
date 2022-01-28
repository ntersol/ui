/**
 * Returns true if the input is null or undefined
 * @param t
 */
export const isNil = <T>(t?: T | null): boolean => t === undefined || t === null;

/**
 * Returns the input value if not nill
 * @param t
 */
export const isNotNil = <T>(t?: T | null): t is T => !isNil(t);

/**
 * Checks an array and returns true if all entries are nil
 * @param ts
 */
export const allNil = <T extends any[]>(...ts: T): boolean => ts.every(isNil);

/**
 * Checks an array and returns true if all entries are not nil
 * @param ts
 */
export const allNotNil = <T extends any[]>(...ts: T): boolean => ts.every(isNotNil);

/**
 * Type check for a boolean
 * @param t
 */
export const isBoolean = (t?: unknown): t is boolean => typeof t === 'boolean';

/**
 * Type check for a string
 * @param t
 */
export const isString = (o?: unknown): o is string => typeof o === 'string';

/**
 * Type check for a number
 * @param t
 */
export const isNumber = (o?: unknown): o is number => typeof o === 'number';

/**
 * Make sure that a string is not empty
 * @param t
 */
export const isNonEmptyString = (t?: unknown): t is string => isString(t) && t.length > 0;

/**
 * Marks keys in RS as required
 */
export type markRequired<T extends Record<any, any>, RS extends keyof T> = Required<Pick<T, RS>> &
  Pick<T, Exclude<keyof T, RS>>;

/**
 * Check if an object has a property
 * @param key
 */
export const hasField =
  <T extends Record<any, any>, K extends keyof T>(key: K) =>
  (obj: T): obj is T & markRequired<T, K> =>
    isNotNil(obj) && isNotNil(obj[key]);
