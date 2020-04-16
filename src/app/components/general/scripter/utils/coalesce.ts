import { isNotNil } from './type-guards';

type Maybe<T> = T | null | undefined;
type MaybeArray<T> = Maybe<T>[];

/**
 * Curried function, takes a default value, then any number of nullable
 * values. Runs through the nullable values until the first non-nil or
 * returns the default value.
 */
export const coalesce = <T>(def: T) => (...ts: MaybeArray<T>): T => {
  const found: T | undefined = ts.find(isNotNil);
  return isNotNil(found) ? found : def;
};
