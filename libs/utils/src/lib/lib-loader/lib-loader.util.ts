import * as dayjs from 'dayjs';
// import * as utc from 'dayjs/plugin/utc';
// import * as timezone from 'dayjs/plugin/timezone';
import { forkJoin, Observable, of } from 'rxjs';

// import { Dayjs } from 'dayjs';
import { scriptLoad$ } from '../..';
import { map, switchMap, tap } from 'rxjs/operators';

// dayjs.extend(utc);
// dayjs.extend(timezone);

declare global {
    interface Window {
        dayjs: dayjs.Dayjs;
    }
}

export type DayJSPlugins = 'utc' | 'timezone';
export interface LibOptions<PluginOptions = string> {
    plugins: PluginOptions[];
}

const libs = {
    dayjs: {
        srcUrl: 'https://unpkg.com/dayjs@1.8.21/dayjs.min.js',
        plugins: {
            utc: 'https://unpkg.com/dayjs@1.8.21/plugin/utc.js',
            timezone: 'https://unpkg.com/dayjs@1.8.21/plugin/timezone.min.js'
        }
    },
};

export function libLoader$(srcUrl: 'dayjs', options?: LibOptions<'utc' | 'timezone'>): Observable<dayjs.Dayjs>;
export function libLoader$(srcUrl: string, options?: LibOptions): Observable<void>;
export function libLoader$(srcUrl: string, options?: LibOptions): Observable<any> {

    switch (srcUrl) {
        case 'dayjs':
            const pluginsSrc: Record<string, Observable<void>> = options?.plugins?.length ? options.plugins.reduce((a, b) => ({ ...a, [b]: scriptLoad$(b) }), {}) : [of()];
            const temp = scriptLoad$(libs.dayjs.srcUrl).pipe(
                switchMap(() => forkJoin(pluginsSrc)),
                tap((plugins: any) => {
                    Object.keys(plugins).forEach(key => dayjs.extend((window as any)['dayjs_plugin_' + key]));
                }),
                map(() => window.dayjs)
            )
            return temp;

        default: return of();

        //break;
    }
}

libLoader$('dayjs', { plugins: ['utc', 'timezone'] }).subscribe(dayjs => {

})

libLoader$('http.whatever').subscribe(() => {

})