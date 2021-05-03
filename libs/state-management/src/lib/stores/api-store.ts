import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, share, tap, take } from 'rxjs/operators';
import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';

/**
 * Automatically create an entity store to manage interaction between a local flux store and a remote api
 */
export class NtsApiStore<dataType> {
  private state: NtsState.ApiState<dataType> = {
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

  private httpGet$: Observable<dataType>;

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
    this.httpGet$ = this.http.get<dataType>(this.apiUrlGet(this.config, 'get', null));
  }

  /**
   * Perform a get request to load data into the store
   * @param optionsSrct
   */
  public get(optionsOverride: NtsState.Options = {}) {
    const options = mergeDeepRight(this.config, optionsOverride);
    // If data is null or refresh cache is requested, otherwise default to cache
    if ((this.state.data === null || options.refreshCache || !this.httpGet$) && !this.state.loading) {
      const url = this.apiUrlGet(options, 'get', null);
      this.stateChange({ loading: true });
      this.httpGet$ = this.http.get<dataType>(url).pipe(
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
              ? result.reduce((a, b) => ({ ...a, [b[String(this.config.uniqueId)]]: b }), {})
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
        take(1), // Ensure http request only fires once since the memory reference is stored
        share(), // If multiple components are requesting data at the same time, share the stream to avoid multiple http requests
      );
    }
    return this.httpGet$;
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
  private apiUrlGet(config: NtsState.Config, verb: keyof NtsState.ApiUrlOverride, e: dataType | null): string {
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
export const ntsApiStore = (http: HttpClient, configSrc?: NtsState.Config) => <dataType>(config: NtsState.Config) =>
  new NtsApiStore<dataType>(http, config, configSrc);
