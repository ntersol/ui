import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';

/**
 * Automatically create an entity store to manage interaction between a local flux store and a remote api
 */
export class NtsApiStore<t> {
  private state: NtsState.ApiState<t> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    entities: null,
    data: null,
  };

  /** Returns both the api state and any data */
  private _state$ = new BehaviorSubject(this.state);
  public state$ = this._state$.pipe(
    tap((s) => {
      if (this.config?.autoLoad !== false && s.data === null && !s.loading) {
        // this.refresh();
      }
    }),
  );

  /** Returns just the data from the api state */
  public data$ = this.state$.pipe(
    map((s) => s.data),
    distinctUntilChanged(),
  );

  /** Store config, contains both the global and specific */
  private config: NtsState.Config = {};

  constructor(private http: HttpClient, private configInstance: NtsState.Config, private configBase?: NtsState.Config) {
    this.config = mergeDeepRight(this.configBase, this.configInstance);
    // If a custom initial state was defined, merge into initial state
    if (this.config.initialState) {
      this.state = mergeDeepRight(this.state, this.config.initialState);
    }
  }

  /**
   * Perform a get request to load data into the store
   * @param optionsSrc
   */
  public get(optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    // If data is null or refresh cache is requested, otherwise default to cache
    if ((this.state.data === null || options.refreshCache) && !this.state.loading) {
      const url = this.apiUrlGet(options, 'get', null);
      this.stateChange({ loading: true });
      return this.http.get<t>(url).pipe(
        // Handle api success
        tap((r) => {
          const result = this.config.map && this.config.map.get ? this.config.map.get(r) : r;
          // Check if the api response type is suitable for entities, IE an array of objects and a uniqueID
          const entities =
            typeof result === 'object' &&
            Array.isArray(result) &&
            result.length &&
            typeof result[0] === 'object' &&
            !Array.isArray(result[0]) &&
            !!this.config.uniqueId
              ? (result.reduce((a, b) => ({ ...a, [b[String(this.config.uniqueId)]]: b }), {}) as Record<string, t>)
              : null;

          // Update state
          this.stateChange({ loading: false, data: result, entities: entities });
        }),
        // Handle api errors
        catchError((err) => {
          // Update state
          this.stateChange({ loading: false, error: err });
          return throwError(err);
        }),
      );
    }
    return this.http.get<t>('');
  }

  /**
   * Refresh the data in the store
   */
  public refresh() {
    return this.get({ refreshCache: true });
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

    if (!!config?.apiUrlOverride && config?.apiUrlOverride[verb]) {
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
export const ntsApiStore = (http: HttpClient, configSrc?: NtsState.Config) => <t>(config: NtsState.Config) =>
  new NtsApiStore<t>(http, config, configSrc);
