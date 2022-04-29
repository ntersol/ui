import { forkJoin, Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';

// A cache that keep track of what scripts have been loaded by their request url
let scriptsLoaded: Record<string, boolean> = {};

/**
 * Load a remote javascript file asychronously. Supports caching and multiple concurrent requesters
 * @param srcUrl A url of a javascript file
 * @author Jerrol Krause
 * @example
 * // Single script
 * scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.min.js').subscribe(() => {
 * // Script loaded successfully
 * })
 *
 * // Multiple scripts
 * scriptLoad$(['https://unpkg.com/dayjs@1.8.21/dayjs.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js']).subscribe(() => {
 * // Script loaded successfully
 * })
 *
 * // Returns a boolean to indicate success/fail
 * public isLoaded$ = scriptLoad$(['https://unpkg.com/dayjs@1.8.21/dayjs.min.js']); // Returns
 *
 * <div *ngIf="isLoaded$ | async"></div>
 * @returns void
 */
export const scriptLoad$ = (srcUrl: string | string[]) => {
  const str = Array.isArray(srcUrl) ? srcUrl : [srcUrl];
  return forkJoin(str.map((s) => scriptLoad(s))).pipe(
    // Flatten any array into a single boolean
    map((results) => results.reduce((a, b) => (a === false ? false : b), true)),
  );
};

/**
 * Load a remote javascript file asychronously. Supports caching and multiple concurrent requesters
 * @param srcUrl A url of a javascript file
 * @author Jerrol Krause
 * @example
 * scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.min.js').subscribe(() => {
 * // Script loaded successfully
 * })
 * @returns void
 */
const scriptLoad = (srcUrl: string) =>
  new Observable<boolean>((obs) => {
    // Check of this script has already been successfully loaded
    if (scriptsLoaded[srcUrl]) {
      obs.next(true);
      obs.complete();
      return;
    }
    // Create new script instance
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = srcUrl;
    script.async = true;

    // On successful load
    script.onload = () => {
      // Update record of scripts that have been loaded
      scriptsLoaded = { ...scriptsLoaded, [srcUrl]: true };
      obs.next(true);
      obs.complete();
    };

    // Handle errors
    script.onerror = () => {
      obs.error(false);
      obs.complete();
    };

    // Insert into dom
    document.getElementsByTagName('body')[0].appendChild(script);
    // Share supports edge case of multiple subscribers requesting script at the same time
    // take is not really necessary but still a good pattern to follow to keep the observable cold
  }).pipe(share(), take(1));
