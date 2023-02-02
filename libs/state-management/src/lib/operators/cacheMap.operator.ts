import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
/**
 * TODO Items:
 * - Support a localstorage option. Will need a method to clear localstorage too
 * - Support a method to clear cache independent of the TTL
 */

interface CacheItem<t> {
  data: t;
  expiry?: number;
  meta?: unknown;
}
type Cache<t = unknown> = Record<string, CacheItem<t>>;
type Options<t> = {
  /** How long should this response belong in the cache in seconds */
  ttl?: number | null | undefined;
  /** Supply a function that returns the upstream data and expects a string to use as a unique ID. Overrides the default ID handling and is useful for scenarios where the upstream data is a non-primitive */
  uniqueIdFn?: (val: t) => string | number;
};

/**
 * Caches an observable stream in memory. Works exactly like mergeMap but uses the upstream data to cache data returned from the downstream observable.
 * Be conscientious of memory management.
 *
 * Prefers the upstream data to be a primitive. Non primitives will be stringified which may still work but likely not reliably
 * @param source
 */
export const cacheMap =
  <y, t>(dest: (x: t) => Observable<y>, options?: Options<t>) =>
  (source: Observable<t>) => {
    /** Store cached data */
    let cache: Cache = {};
    return source.pipe(
      mergeMap((s) => {
        // Generate a uniqueID from the source
        // If custom function supplied, use that
        const uniqueId = options?.uniqueIdFn ? String(options.uniqueIdFn(s)) : generateUniqueId(s);
        // Get current time
        const now = new Date();
        // Get cache item for typesafety
        const cacheItem = cache[uniqueId];
        // Check if current time is greater than cache time, if so clear cache item
        if (cacheItem?.expiry && now.getTime() > cacheItem.expiry) {
          cache = Object.assign({}, cache);
          delete cache[uniqueId];
        }
        // If found in the cache, return from cache
        else if (cache[uniqueId]) {
          // console.log('from cache', uniqueId);
          return of(cache[uniqueId].data as y);
        }
        // Return data from stream instead of cache
        return dest(s).pipe(
          // After child operator emits, store result in the cache
          tap((result) => {
            // console.log('from stream', uniqueId);
            // Check if TTL is specified, if so set expiry
            const payload: CacheItem<y> = options?.ttl
              ? { data: result, expiry: now.getTime() + options.ttl * 1000 }
              : { data: result };
            cache = Object.assign({}, cache, { [uniqueId]: payload });
          }),
        );
      }),
    );
  };

/**
 * Generate a unique ID from an unknown input
 * @param value
 * @returns
 */
const generateUniqueId = (value: unknown) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};
