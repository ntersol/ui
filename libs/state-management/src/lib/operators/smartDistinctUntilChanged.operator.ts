import { Observable, OperatorFunction } from 'rxjs';

/**
 * A custom RXJS operator that can be used to check if the current emission from an observable stream is the same as the previous emission. Unlike the standard distinctUntilChanged operator, this operator recursively evaluates arrays and objects to see if they match, even if the memory value isn't identical via "===".
 *
 * #### Limitations ####
 * - May be costly for large objects or arrays, use distinctUntilChanged with a custom comparator if that's the case
 * - Will not work for classes or complex objects with accessors or methods
 * @param source
 */
export function smartDistinctUntilChanged<T>(): OperatorFunction<T, T> {
  let previousValue: T;
  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      return source.subscribe({
        next: (value) => {
          // console.log(1, value, previousValue, isEqual(value, previousValue));
          if (!isEqual(value, previousValue)) {
            observer.next(value);
            previousValue = value;
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}

/**
 * Compares two values to see if they are equal. Supports primitive values, objects, and arrays.
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns Returns true if the values are equal, false otherwise.
 */
const isEqual = (a?: unknown, b?: unknown): boolean => {
  // Primitives, memory value matches or nil value matches
  if (a === b) return true;
  // Nill non matches
  if (a == null || b == null || a == undefined || b == undefined) return false;

  // Objects
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    // Iterate through all the keys, and compare each key's value
    for (let i = 0; i < aKeys.length; i++) {
      const key = aKeys[i]; // as keyof typeof a;

      // Check if the key exists in both objects
      if (!Object.prototype.hasOwnProperty.call(b ?? {}, key)) return false;

      // Recursively compare the values of the current key
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;

    // Arrays
  } else if (Array.isArray(a) && Array.isArray(b)) {
    // Check array length
    if (a.length !== b.length) return false;
    // Loop through the array and compare all nested values
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
};
