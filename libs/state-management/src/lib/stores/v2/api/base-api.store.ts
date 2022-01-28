import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, share, take, tap } from 'rxjs/operators';
import { apiUrlGet, is, mergeConfig } from '../../api/api-store.utils';
import { NtsState2 } from '../state2.models';

const stateSrc = {
  loading: false,
  modifying: false,
  error: false,
  errorModify: false,
  data: null,
};

/**
 *
 * @param http
 * @param config
 * @param initialState
 * @returns
 */
export const ntsBaseApiStore = <t = any>(
  http: HttpClient,
  config: NtsState2.Config | NtsState2.ConfigEntity,
  initialState: any,
) => {
  //
  const state = Object.assign({}, stateSrc, initialState);
  //
  const state$ = new BehaviorSubject(state);
  let httpGet$: Observable<t>;

  const _get = function <t>(optionsOverride: NtsState2.Options = {}, postPayload?: unknown) {
    const options = mergeConfig(config, optionsOverride);
    // If data is null or refresh cache is requested, otherwise default to cache
    if ((state.data === null || options.refresh || !httpGet$) && !state.loading) {
      const url = apiUrlGet(options, 'get', null);
      // Set loading to true, reset any errors
      store.stateChange({ loading: true, error: null });
      // Dispatch event to the global scope
      if (config.storeId) {
        // this.dispatch({ type: ApiEvents.GET_START, storeId: config.storeId, payload: null });
      }
      // Is this a GET request or a POST that functions as a GET
      // Some data request require a post body
      const httpRequest = postPayload ? http.post<any>(url, postPayload) : http.get<t>(url);
      httpGet$ = httpRequest.pipe(
        // Handle api success
        tap((r) => {
          // Map api response if requested
          const result = config.map && config.map.get ? config.map.get(r) : r;
          const state: Partial<NtsState2.ApiState> = { loading: false, data: result };
          let entities: Record<string, t> | null = null;
          // Check if this api response has entities, create entity property
          const config = config; // Run through typeguard so it doesn't need to be typechecked again in the reduce
          if (this.isEntityStore && is.entityConfig(config) && config.uniqueId && Array.isArray(result)) {
            entities = <Record<string, t>>(
              result.reduce((a: any, b: any) => ({ ...a, [b[String(config.uniqueId)]]: b }), {})
            );
            state.entities = entities;
          }

          // Update state
          store.stateChange(state);
          // Dispatch event to the global scope
          if (config.storeId) {
            // this.dispatch({ type: ApiEvents.GET_SUCCESS, storeId: config.storeId, payload: r });
          }
        }),
        // Handle api errors
        catchError((err) => {
          // Update state
          store.stateChange({ loading: false, error: err });
          if (config.storeId) {
            // this.dispatch({ type: ApiEvents.GET_ERROR, storeId: config.storeId, payload: err });
          }
          return throwError(err);
        }),
        take(1), // Ensure http request only fires once since the memory reference is stored
        share(), // If multiple components are requesting data at the same time, share the stream to avoid multiple http requests
      );
    }
    return httpGet$;
  };

  const store: NtsState2.ApiBaseStore = {
    state$: state$.pipe(
      // Autoload
      tap((s) => {
        if (config.autoLoad && s.data === null && !this.autoloaded) {
          // this.autoloaded = true;
          store.get().subscribe();
        }
      }),
    ),
    stateChange: () => {},
    get: function <t>(optionsOverride: NtsState2.Options = {}) {
      return _get<t>(optionsOverride);
    },
  };
  return store;
};

ntsBaseApiStore({}, {}, {});
