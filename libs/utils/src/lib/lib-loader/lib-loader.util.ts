
import { forkJoin, Observable, of } from 'rxjs';
import { map, share, switchMap, take } from 'rxjs/operators';
import { scriptLoad$ } from '../script-loader/script-loader.util';

// Lib definitions
import * as dayjs from 'dayjs';
import * as jquery from 'jquery';

// Window extension
declare global {
  interface Window {
    dayjs: () => dayjs.Dayjs;
    $: JQuery
  }
}

export namespace LibLoader {
  export type Libs = DayJSLib | jQueryLib;

  // DayJS config
  export interface DayJSLib extends Options {
    lib: 'dayjs';
    plugins?: ('utc' | 'timezone' | 'calendar')[];
  }
  // jQuery
  export interface jQueryLib extends Options {
    lib: 'jquery';
  }



  export interface Options {
    lib: string;
    version: string;
  }

  export type AvailableLibs = 'dayjs' | 'jquery';
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
  jquery: {
    srcUrl: (version: string) => `https://cdnjs.cloudflare.com/ajax/libs/jquery/${version}/jquery.min.js`,
    srcUrlPlugins: (version: string, plugin: string) => `https://cdnjs.cloudflare.com/ajax/libs/jquery/${version}/plugin/${plugin}.min.js`,
  }
};

/**
 * Load jQuery, are you really sure you have to?
 * @param srcUrl
 * @param options
 */
export function libLoader$(
  lib: LibLoader.jQueryLib,
): Observable<typeof jquery>;
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
  let url = '';
  switch (libType.lib) {
    case 'dayjs':
      // Resolve url if string or callback function
      url = typeof libs.dayjs.srcUrl === 'string' ? libs.dayjs.srcUrl : libs.dayjs.srcUrl(libType.version);
      // Get scripts for plugins
      const plugins = libType?.plugins?.length
        ? libType.plugins?.map(plugin => {
          const urlPlugin = typeof plugin === 'string' && libs?.dayjs?.srcUrlPlugins ? plugin : libs.dayjs.srcUrlPlugins(libType.version, plugin);
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
      break;
    case 'jquery':
      // Resolve url if string or callback function
      url = typeof libs.jquery.srcUrl === 'string' ? libs.jquery.srcUrl : libs.jquery.srcUrl(libType.version);
      // Get main http call
      lib = scriptLoad$(url).pipe(
        map(() => window.$),
      );
      break;
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