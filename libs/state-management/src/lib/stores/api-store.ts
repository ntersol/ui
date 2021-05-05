import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, share, tap, take } from 'rxjs/operators';
import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';
import {
  apiUrlGet,
  deleteEntities,
  is,
  isEntity,
  mergeDedupeArrays,
  mergePayloadWithApiResponse,
} from './api-store.utils';

/**
 * Automatically create an entity store to manage interaction between a local flux store and a remote api
 */
export class NtsApiStoreCreator<t, t2 = any> {
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

  /** Global store config config, contains mashup of all instances. Below is the default config */
  private config: NtsState.Config | NtsState.ConfigEntity = {
    autoLoad: true,
    // storeId: 'store-' + Math.floor(Math.random() * 10000000000),
  };

  constructor(private http: HttpClient, config: NtsState.Config | NtsState.ConfigEntity, private isEntityStore = true) {
    // Merge all configs into single entity
    this.config = mergeDeepRight(this.config, config);
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
          if (this.isEntityStore && is.entityConfig(config) && isEntity(result, config.uniqueId) && config.uniqueId) {
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
      tap(() => {
        if (
          this.isEntityStore &&
          is.entityConfig(this.config) &&
          !!this.state?.data &&
          Array.isArray(this.state.data)
        ) {
          console.log(deleteEntities(this.state.data, data, this.config.uniqueId));
          const updated = deleteEntities(this.state.data, data, this.config.uniqueId);
          this.stateChange({ modifying: false, ...updated });
        } else {
          this.stateChange({ modifying: false });
        }
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
        if (
          this.isEntityStore &&
          is.entityConfig(this.config) &&
          !!this.state?.data &&
          Array.isArray(this.state.data)
        ) {
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
 * Create a curried instance of the api store creator
 *
 * @example
 * private store = ntsApiStoreCreator(this.http, { apiUrlBase: '//jsonplaceholder.typicode.com' })
 * @param http A reference to Angular's http service
 * @param configBase Default configuration for all instances of this store. Will be overwritten by individual store properties
 * @returns
 */
export const ntsApiStoreCreator = (http: HttpClient, configBase?: NtsState.Config | null) => {
  const store: {
    /**
     * Create an instance of an entity based api store. Used for managing an array of objects
     * @example
     * public users = this.store<Models.User>({ apiUrl: '/users' });
     * @param config Store configuration and options
     * @param isEntityStore Should the store create and manage entities
     * @returns
     */
    <t>(config: NtsState.ConfigEntity, isEntityStore?: true): NtsApiStoreCreator<t[]>;
    /**
     * Create an instance of a non-entity based api store. Used for managing all none entity types
     * @example
     * public users = this.store<Models.User>({ apiUrl: '/users' }, false);
     * @param config Store configuration and options
     * @param isEntityStore Should the store create and manage entities
     * @returns
     */
    <t>(config: NtsState.Config, isEntityStore?: false): NtsApiStoreCreator<t>;
  } = <t>(
    config: NtsState.Config | NtsState.ConfigEntity,
    isEntityStore = true,
  ): NtsApiStoreCreator<t> | NtsApiStoreCreator<t[]> =>
    isEntityStore
      ? new NtsApiStoreCreator<t[], t>(http, mergeDeepRight(configBase || {}, config), isEntityStore)
      : new NtsApiStoreCreator<t, t>(http, mergeDeepRight(configBase || {}, config), isEntityStore);
  return store;
};

/**
 * Create an instance of an api store
 * @param http
 * @param configSrc
 * @returns

export function ntsApiStoreCreator<t>(http: HttpClient, config: NtsState.Config, isEntityStore: false): NtsApiStoreCreator<t>;
export function ntsApiStoreCreator<t>(http: HttpClient, config: NtsState.EntityConfig, isEntityStore: true): NtsApiStoreCreator<t[]>;
export function ntsApiStoreCreator<t>(
  http: HttpClient,
  config: NtsState.Config | NtsState.EntityConfig,
  isEntityStore?: boolean,
): NtsApiStoreCreator<t> | NtsApiStoreCreator<t[]> {
  if (isEntityStore) {
    return new NtsApiStoreCreator<t[], t>(http, config);
  } else {
    return new NtsApiStoreCreator<t, t>(http, config);
  }
}
 */

/**
 * interface User {
  v?: boolean;
}
const temp = ntsApiStoreCreator2('' as any, {});
const users = temp<User>({ uniqueId: 'test' }, true);
const users2 = temp<User>({ uniqueId: 'test' }, false);
// This works!
const temp = ntsApiStoreCreator5<User>('' as any, {}, false);
const temp2 = ntsApiStoreCreator5<User>('' as any, {}, true);

export const ntsApiStoreCreator7 = (http: HttpClient, config: NtsState.Config) => {
  return ntsApiStoreCreator5;
};

const storeBase = ntsApiStoreCreator7('' as any, {});
const users = storeBase<User>('' as any, {}, true);
const users2 = storeBase<User>('' as any, {}, false);

interface User {
  v: boolean;
}
 */
