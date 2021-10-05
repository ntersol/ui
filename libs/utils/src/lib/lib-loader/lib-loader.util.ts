import * as dayjs from 'dayjs';
import { forkJoin, Observable, of } from 'rxjs';

import { scriptLoad$ } from './script-loader.util';
import { concatMap, map, share, switchMap, take, tap } from 'rxjs/operators';

declare global {
  interface Window {
    dayjs: () => dayjs.Dayjs;
  }
}

export namespace LibLoader {
  export type Libs = DayJSLib;

  // DayJS config
  type DayJSPlugins = 'utc' | 'timezone' | 'calendar';
  export interface DayJSLib extends Options<DayJSPlugins> {
    lib: 'dayjs';
  }

  export interface Options<t = string> {
    lib: string;
    version: string;
    plugins?: t[];
  }

  export type AvailableLibs = 'dayjs';
  export type Definitions = Record<AvailableLibs, DefinitionOptions>;
  export interface DefinitionOptions {
    /** Source url of the main library url file */
    srcUrl: (version: string) => string | string;
    /** A record  */
    srcUrlPlugins: (version: string, plugin: string) => string | string;
  }
  export type Plugins = Record<string, string>;

  export type UrlResolver = (version: string) => string;
}

const libs: LibLoader.Definitions = {
  dayjs: {
    srcUrl: (version: string) => `https://cdnjs.cloudflare.com/ajax/libs/dayjs/${version}/dayjs.min.js`,
    srcUrlPlugins: (version: string, plugin: string) => `https://cdnjs.cloudflare.com/ajax/libs/dayjs/${version}/plugin/${plugin}.min.js`,
  },
};

/**
 * Keep track of which scripts have been loaded
 */
const cache: Record<string, boolean> = {};

/**
 * Load dayJS, a fantastic JS date manipulation library
 * @param srcUrl
 * @param options
 */
export function libLoader$<t = dayjs.Dayjs>(
  lib: LibLoader.DayJSLib,
): Observable<(date?: string | number | t | Date | null | undefined) => t>;
export function libLoader$(lib: LibLoader.Libs): Observable<void>;
/**
 *
 * @param srcUrl
 * @param options
 * @returns
 */
export function libLoader$(libType: LibLoader.Libs): Observable<any> {
  let lib = of();
  switch (libType.lib) {
    case 'dayjs':
      // Resolve url if string or callback function
      const url = typeof libs.dayjs.srcUrl === 'string' ? libs.dayjs.srcUrl : libs.dayjs.srcUrl(libType.version);
      // Get scripts for plugins
      const plugins = libType?.plugins?.length
        ? libType.plugins?.map(plugin => {
            const urlPlugin = typeof plugin === 'string' ? plugin : libs.dayjs.srcUrlPlugins(libType.version, plugin);
            return scriptLoad$(urlPlugin);
          })
        : [of(null)];
      // Get main http call
      lib = scriptLoad$(url).pipe(
        // Add in any plugins
        switchMap(() => plugins),
        // tap((plugins: any) => Object.keys(plugins).forEach(key => dayjs.extend((window as any)['dayjs_plugin_' + key]))),
        // Return window entity
        map(() => window.dayjs),
      );
  }
  return lib.pipe(take(1), share());
}

/**
 *
 * @param plugins
 * @returns
 */
export function pluginsGet(plugins?: string[] | null) {
  const pluginsSrc: Record<string, Observable<void>> = {};
  /**
   *   const pluginsSrc: Record<string, Observable<void>> = options?.plugins?.length
        ? options.plugins.reduce((a, b) => ({ ...a, [b]: scriptLoad$((libs as any).dayjs.plugins[b]) }), {})
        : [of()];
   */
  if (plugins?.length) {
    plugins.forEach(str => {
      console.log(str);
    });
  }

  return forkJoin(pluginsSrc);
}

/** */
libLoader$({ lib: 'dayjs', version: '1.10.7', plugins: ['utc'] }).subscribe(dayjs => {
  console.warn('Test', dayjs());
});
