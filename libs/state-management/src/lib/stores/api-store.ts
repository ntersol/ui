import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, share, tap, take } from 'rxjs/operators';
import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';
import { apiUrlGet, is, isEntity, mergeDedupeArrays, mergePayloadWithApiResponse } from './api-store.utils';

/**
 * Automatically create an entity store to manage interaction between a local flux store and a remote api
 */
export class NtsApiStore<t, t2 = any> {
  private state: NtsState.ApiState<t> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    entities: null,
    data: null,
  };

  /** Returns both the api state and data */
  private _state$ = new BehaviorSubject(this.state);
  public state$ = this._state$.pipe(
    // Autoload??
    tap((s) => {
      if (this.config.autoLoad && s.data === null && !s.loading) {
      }
    }),
  );

  /** Returns just the data */
  public data$ = this.state$.pipe(
    map((s) => s.data),
    distinctUntilChanged(),
  );

  /** Store a shared reference to the http get request so it can be canceled and shared */
  private httpGet$: Observable<t>;

  /** Is this store an entity type? */
  public isEntityStore = false;

  /** Global store config config, contains mashup of all instances. Below is the default config */
  private config: NtsState.Config = {
    autoLoad: true,
    name: 'store-' + Math.floor(Math.random() * 10000000000),
  };

  constructor(private http: HttpClient, configInstance: NtsState.Config, configBase?: NtsState.Config) {
    // Merge all configs into single entity
    this.config = mergeDeepRight({ ...this.config, ...configBase }, configInstance);
    // If a custom initial state was defined, merge into initial state
    if (this.config.initialState) {
      this.state = mergeDeepRight(this.state, this.config.initialState);
    }
    // Create initial instance of http get, mostly just for type safety
    this.httpGet$ = this.http.get<t>(apiUrlGet(this.config, 'get', null));
  }

  /**
   * Perform a get request to load data into the store
   * @param optionsSrct
   */
  public get(optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    // If data is null or refresh cache is requested, otherwise default to cache
    if ((this.state.data === null || options.refresh || !this.httpGet$) && !this.state.loading) {
      const url = apiUrlGet(options, 'get', null);
      this.stateChange({ loading: true });
      this.httpGet$ = this.http.get<t>(url).pipe(
        // Handle api success
        tap((r) => {
          // Map api response if requested
          const result = this.config.map && this.config.map.get ? this.config.map.get(r) : r;
          const state: Partial<NtsState.ApiState> = { loading: false, data: result };
          let entities: Record<string, t> | null = null;
          // Check if this api response has entities, create entity property
          const config = this.config; // Run through typeguard so it doesn't need to be typechecked again in the reduce
          if (is.entityConfig(config) && isEntity(result, config.uniqueId) && config.uniqueId) {
            entities = <Record<string, t>>result.reduce((a, b: any) => ({ ...a, [b[String(config.uniqueId)]]: b }), {});
            state.entities = entities;
          }

          // Update state
          this.stateChange(state);
        }),
        // Handle api errors
        catchError((err) => {
          // Update state
          this.stateChange({ loading: false, error: err });
          return throwError(err);
        }),
        take(1), // Ensure http request only fires once since the memory reference is stored
        share(), // If multiple components are requesting data at the same time, share the stream to avoid multiple http requests
      );
    }
    return this.httpGet$;
  }

  /**
   * Perform a POST request
   * @param data
   * @param optionsOverride
   * @returns
   */
  public post(data: Partial<t2> | Partial<t2>[], optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    const url = apiUrlGet(options, 'post', null);
    return this.upsert(this.http.post(url, data), data, this.config.map?.post);
  }

  /**
   * Perform a PUT request
   * @param data
   * @param optionsOverride
   * @returns
   */
  public put(data: Partial<t2> | Partial<t2>[], optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    const url = apiUrlGet(options, 'put', data);
    return this.upsert(this.http.put(url, data), data, this.config.map?.put);
  }

  /**
   * Perform a PATCH request
   * @param data
   * @param optionsOverride
   * @returns
   */
  public patch(data: Partial<t2> | Partial<t2>[], optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    const url = apiUrlGet(options, 'patch', data);
    return this.upsert(this.http.patch(url, data), data, this.config.map?.patch);
  }

  /**
   * Perform a DELETE request
   * @param data
   * @param optionsOverride
   * @returns
   */
  public delete(data: Partial<t2> | Partial<t2>[], optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    const url = apiUrlGet(options, 'delete', data);
    // Reset state
    this.stateChange({ modifying: true, errorModify: null });
    return this.http.delete(url).pipe(
      tap((r) => {
        console.log(r);
        // Perform delete
        this.stateChange({ modifying: false });
      }),
      // Handle error
      catchError((err) => {
        // Update state
        this.stateChange({ modifying: false, errorModify: err });
        return throwError(err);
      }),
    );
  }

  /**
   *
   * @param apiRequest
   * @param data
   * @returns
   */
  private upsert<t>(apiRequest: Observable<t>, data: t | t[], mapFn?: <t>(x: t | null) => any) {
    // Reset state
    this.stateChange({ modifying: true, errorModify: null });
    // Make api request
    return apiRequest.pipe(
      // Handle success
      tap((r) => {
        // If a map function was provided, modify the data before executing anything else
        const resMapped = mapFn ? mapFn(r) : r;
        // Merge the api response with the payload
        const resMerged = mergePayloadWithApiResponse(data, resMapped);
        // If this
        if (is.entityConfig(this.config) && !!this.state?.data && Array.isArray(this.state.data)) {
          const delta = mergeDedupeArrays(this.state.data, resMerged, this.config.uniqueId as keyof t);
          this.stateChange({ modifying: false, ...delta });
        } else {
          this.stateChange({ modifying: false, resMerged });
        }
      }),
      // Handle error
      catchError((err) => {
        // Update state
        this.stateChange({ modifying: false, errorModify: err });
        return throwError(err);
      }),
    );
  }

  /**
   * Refresh the data in the store
   */
  public refresh() {
    return this.get({ refresh: true });
  }

  /**
   * Perform updates to the base state object, shallow only
   * @param state
   */
  private stateChange(state: Partial<NtsState.ApiState>) {
    this.state = { ...this.state, ...state };
    this._state$.next(this.state);
  }
}

/**
 * Create an instance of an api store
 * @param http
 * @param configSrc
 * @returns
 */
export function ntsApiStore<t>(http: HttpClient, config: NtsState.Config, isEntityStore: false): NtsApiStore<t>;
export function ntsApiStore<t>(http: HttpClient, config: NtsState.EntityConfig, isEntityStore: true): NtsApiStore<t[]>;
export function ntsApiStore<t>(
  http: HttpClient,
  config: NtsState.Config | NtsState.EntityConfig,
  isEntityStore?: boolean,
): NtsApiStore<t> | NtsApiStore<t[]> {
  if (isEntityStore) {
    return new NtsApiStore<t[], t>(http, config);
  } else {
    return new NtsApiStore<t, t>(http, config);
  }
}
/**
// This works!
const temp = ntsApiStore5<User>('' as any, {}, false);
const temp2 = ntsApiStore5<User>('' as any, {}, true);

export const ntsApiStore7 = (http: HttpClient, config: NtsState.Config) => {
  return ntsApiStore5;
};

const storeBase = ntsApiStore7('' as any, {});
const users = storeBase<User>('' as any, {}, true);
const users2 = storeBase<User>('' as any, {}, false);

interface User {
  v: boolean;
}
 */
