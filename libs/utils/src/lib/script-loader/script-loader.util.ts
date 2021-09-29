import { Observable } from 'rxjs';
import { share, take } from 'rxjs/operators';

// A cache that keep track of what scripts have been loaded by their request url
let scriptsLoaded: Record<string, boolean> = {};

/**
 * Load a remote javascript file asychronously. Supports caching and multiple concurrent requesters
 * @param srcUrl A url of a javascript file
 * @example
 * scriptLoad$('https://unpkg.com/dayjs@1.8.21/dayjs.min.js').subscribe(() => {
 * // Script loaded successfully
 * })
 * @returns void
 */
export const scriptLoad$ = <t = void>(srcUrl: string) =>
    new Observable<t>(obs => {
        // Check of this script has already been successfully loaded
        if (!!scriptsLoaded[srcUrl]) {
            obs.next();
            obs.complete();
            return;
        }
        // Create new script instance
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = srcUrl;
        script.async = true;

        // On successful load
        script.onload = () => {
            // Update record of scripts that have been loaded
            scriptsLoaded = { ...scriptsLoaded, [srcUrl]: true };
            obs.next();
            obs.complete();
        };

        // Handle errors
        script.onerror = error => {
            obs.error('Unable to load script: ' + srcUrl + ' with error ' + error);
            obs.complete();
        };

        // Insert into dom
        document.getElementsByTagName('body')[0].appendChild(script);
        // Share supports edge case of multiple subscribers requesting script at the same time
        // take is not really necessary but still a good pattern to follow to keep the observable cold
    }).pipe(share(), take(1));
