import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, share, tap, take } from 'rxjs/operators';
import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';
import { isEntity } from './api-store.utils';

/**
 * Automatically create an entity store to manage interaction between a local flux store and a remote api
 */
export class NtsApiStore<t, t_dataType = any> {
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
    // Create initial instance of http get
    this.httpGet$ = this.http.get<t>(this.apiUrlGet(this.config, 'get', null));

    if (this.config.isEntityStore !== undefined) {
      this.isEntityStore = this.config.isEntityStore;
    }
  }

  /**
   * Perform a get request to load data into the store
   * @param optionsSrct
   */
  public get(optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    // If data is null or refresh cache is requested, otherwise default to cache
    if ((this.state.data === null || options.refresh || !this.httpGet$) && !this.state.loading) {
      const url = this.apiUrlGet(options, 'get', null);
      this.stateChange({ loading: true });
      this.httpGet$ = this.http.get<t>(url).pipe(
        // Handle api success
        tap((r) => {
          // Map api response if requested
          const result = this.config.map && this.config.map.get ? this.config.map.get(r) : r;
          const state: Partial<NtsState.ApiState> = { loading: false, data: result };
          let entities = null;
          // Check if this api response has entities, create entity property
          if (isEntity(result, this.config.uniqueId) && this.config.uniqueId) {
            entities = result.reduce((a: any, b: any) => ({ ...a, [b[String(this.config.uniqueId)]]: b }), {});
            state.entities = entities;
            this.isEntityStore = true;
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
   *
   * @param data
   * @param optionsOverride
   * @returns
   */
  public post<postResponse = Partial<t_dataType> | Partial<t_dataType>[]>(
    data: Partial<t_dataType> | Partial<t_dataType>[],
    optionsOverride?: NtsState.Options,
  ) {
    const options = mergeDeepRight(this.config, optionsOverride);
    const url = this.apiUrlGet(options, 'post', null);
    return this.upsert(this.http.post<postResponse>(url, data), data);
    /**
    return this.http.post<postResponse>(url, data).pipe(
      tap((r) => {
        // Map api response if requested
        const result: postResponse = this.config?.map?.post ? this.config.map.post(r) : r;
        if (this.isEntityStore && Array.isArray(this.state.data) && this.config.uniqueId) {

          // Create new data reference
          const data = [...this.state.data];

          // Loop through new data array and if/when a match is found, update the entity in the store in the array
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            // If unique ID's match
            if (element[this.config.uniqueId] === result[this.config.uniqueId]) {
              // Update the data instance. If replace is requested, replace instead of deep merging
              data[i] = this.config.replace ? result : mergeDeepRight(data[i], result);
              break; // End loop
            }
            // Update state
            this.stateChange({
              modifying: false,
              data: data,
              // Replace reference in entities as well
              entities: { ...this.state.data, [result[this.config.uniqueId]]: result },
            });
          }

        } else {
          this.stateChange({ modifying: false, data: result });
        }
      }),
      catchError((err) => {
        // Update state
        this.stateChange({ modifying: false, errorModify: err });
        return throwError(err);
      }),

    );
    */
  }

  private upsert(apiRequest: Observable<any>, data: Partial<t_dataType> | Partial<t_dataType>[]) {
    console.log(1);
    return apiRequest.pipe(
      tap((res) => {
        // If web api response is nill, default to supplied entity
        let result = res === null || res === undefined ? <t | t[]>data : res;
        // If string returned, it is the unique ID and replace the entity property for that
        if (typeof res === 'string' && this.config.uniqueId) {
          result[this.config.uniqueId] = res;
          // Object is returned, merge response with entity supplied. Response takes priority
        } else if (typeof res === 'object' && !Array.isArray(res)) {
          result = Object.assign(data, res);
        }
        // If map function pass result through that
        //result = mapped ? mapped(result) : result;
        // Convert to array
        // const resultArray = !Array.isArray(result) ? [result] : result;
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

  /**
   * Get the api url for this request
   * @param config
   * @param verb
   * @returns
   */
  private apiUrlGet(config: NtsState.Config, verb: keyof NtsState.ApiUrlOverride, e: t | null): string {
    if (!config.apiUrl) {
      console.error('Please define an apiUrl');
      return '/';
    }
    // Get default api URL
    let apiUrl: NtsState.ApiUrl = config.apiUrl;

    if (!!config?.apiUrlOverride && !!config?.apiUrlOverride[verb]) {
      apiUrl = config.apiUrlOverride[verb] || ''; // TODO
    }

    // If the api type is a function, execute it against the entity provided
    if (typeof apiUrl === 'function') {
      apiUrl = apiUrl(e || null);
    }

    // If prepend url is specified
    if (config.apiUrlPrepend) {
      apiUrl = config.apiUrlPrepend + apiUrl;
    }

    // If append url is specified
    if (config.apiUrlAppend) {
      apiUrl = apiUrl + config.apiUrlAppend;
    }

    return apiUrl;
  }
}

/**
 * Create an instance of an api store
 * @param http
 * @param configSrc
 * @returns
 */
export function ntsApiStore<t>(http: HttpClient, config: NtsState.Config, isEntityStore: false): NtsApiStore<t>;
export function ntsApiStore<t>(http: HttpClient, config: NtsState.Config, isEntityStore: true): NtsApiStore<t[]>;
export function ntsApiStore<t>(
  http: HttpClient,
  config: NtsState.Config,
  isEntityStore: boolean,
): NtsApiStore<t> | NtsApiStore<t[]>;
export function ntsApiStore<t>(
  http: HttpClient,
  config: NtsState.Config,
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
