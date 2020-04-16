export const isNil = <T>(t?: T | null): boolean => t === undefined || t === null;

export const isNotNil = <T>(t?: T | null): t is T => !isNil(t);

export const allNil = <T extends any[]>(...ts: T): boolean => ts.every(isNil);

export const allNotNil = <T extends any[]>(...ts: T): boolean => ts.every(isNotNil);

export const isBoolean = (t?: unknown): t is boolean => typeof t === 'boolean';

export const isString = (o?: unknown): o is string => typeof o === 'string';

export const isNonEmptyString = (t?: unknown): t is string => isString(t) && t.length > 0;

export const hasField = <T extends Record<any, any>, K extends keyof T>(key: K) => (
  obj: T,
): obj is T & MarkRequired<T, K> => isNotNil(obj) && isNotNil(obj[key]);

/**
 * Marks keys in RS as required
 */
export type MarkRequired<T extends Record<any, any>, RS extends keyof T> = Required<Pick<T, RS>> &
  Pick<T, Exclude<keyof T, RS>>;
