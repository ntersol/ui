import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

interface CacheItem<t> {
  data: t;
  expiry?: any;
  meta?: any;
}
type Cache<t = unknown> = Record<string, CacheItem<t>>;
type Options = {
  /** How long should this response belong in the cache in seconds */
  ttl?: number | null | undefined;
  // TODO: Not supported
  /** Should this data be stored in localstorage instead of memory */
  localStorage?: boolean; // TODO: Not implemented yet
  /** Supply a unique ID for this stream. By default the upstream data is used but in the case of non-primitives such as large objects or classes that may not be ideal */
  uniqueId?: string; // TODO: Not implemented yet
};
/** Store cached data */
let cache: Cache = {};

/**
 * Caches an observable stream. Works exactly like mergeMap but uses the upstream data to cache the downstream data
 *
 * Expects the upstream data to be a primitive. Non primitives will be stringified which will still work but likely not reliably
 * @param source
 */
export const cacheMap =
  <y, t>(dest: (x: t) => Observable<y>, options?: Options) =>
  (source: Observable<t>) => {
    return source.pipe(
      mergeMap((s) => {
        // Generate a uniqueID from the source
        const uniqueId = generateUniqueId(s);
        // Get current time
        const now = new Date();
        // Check if current time is greater than cache time, if so clear cache item
        if (cache[uniqueId] && now.getTime() > cache[uniqueId].expiry) {
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
 *  Generate a unique ID from an unknown input
 * @param value
 * @returns
 */
const generateUniqueId = (value: unknown) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return slug(value);
};

/** Create a slug value from unknown input */
const slug = (value: unknown) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/ /gi, '-')
    .replace(/[^A-Z0-9-]/gi, '');
