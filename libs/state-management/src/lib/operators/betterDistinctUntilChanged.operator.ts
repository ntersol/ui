import { Observable, OperatorFunction } from 'rxjs';

/**
 * An advanced version of distinctUntilChanged that will also recursively evaluate arrays and objects to see if they match even if the memory value isn't identical via "==="
 *
 * #### Limitations ####
 * - May be costly for large objects or arrays, use distinctUntilChanged with a custom comparator if that's the case
 * - Will not work for classes or complex objects with accessors or methods
 * @param source
 */
export function betterDistinctUntilChanged<T>(): OperatorFunction<T, T> {
  let previousValue: T;
  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      return source.subscribe({
        next: (value) => {
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
 * Check if the input arguments are equal, looks at all javascript types
 * Will not work with classes or complex objects with methods or accessors
 * @param a
 * @param b
 * @returns
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

    for (let i = 0; i < aKeys.length; i++) {
      // Get typesafe keys
      const aKey = aKeys[i] as keyof typeof a;
      const bKey = bKeys[i] as keyof typeof b;
      // Get values
      const aValue = a[aKey];
      const bValue = b[bKey];

      // Check that each key is present in each object and that the values match
      if ((b && !Object.prototype.hasOwnProperty.call(b, aKey)) || !isEqual(aValue, bValue)) return false;
    }
    return true;
    // Arrays
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
};
