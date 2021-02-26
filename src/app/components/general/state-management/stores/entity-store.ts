import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap, share, take } from 'rxjs/operators';
import { throwError, Observable, isObservable } from 'rxjs';
import {
  applyTransaction,
  EntityStore,
  QueryEntity,
  SelectAllOptionsB,
  SelectAllOptionsA,
  SelectAllOptionsC,
  SelectAllOptionsD,
  SelectAllOptionsE,
} from '@datorama/akita';
import { initialEntityState } from '../utils/initialState';
import { NtsState } from '../state';

/**
 * Dynamically created an Akita store for entities
 */
export class NtsEntityStore<t> {
  public store: EntityStore<NtsState.EntityState<t, any>, any, any>; // TODO: Type this better
  public query: QueryEntity<NtsState.EntityState<t, any>, any, any>; // TODO: Type this better
  /** Select the store state and all entities */
  public select$: Observable<NtsState.EntityState<t, any>>;
  /** Select the store state and a subset of entities using Akita's standard query parameters for selectAll */
  public selectAll$: (
    select?:
      | SelectAllOptionsA<t>
      | SelectAllOptionsB<t>
      | SelectAllOptionsC<t>
      | SelectAllOptionsD<t>
      | SelectAllOptionsE<t>,
  ) => Observable<NtsState.EntityState<t, any>>;

  /** Unique ID of the entity */
  private idKey: string | number = 'guid';
  /** This prop is used to track if the store has received at least one successful get request, even if response was empty  */
  private hasData = false;
  /** Store the compiled result for the data property here.
   * This is to ensure that a new memory reference is passed only on specific conditions */
  private data: null | t[] = null;
  /** Used to keep a single observable instance of http GET for multicasting.
   * Multiple components can call GET at the same time but only one http request is made and the result shared with all subscribers */
  private httpGet$: Observable<t[]> | undefined;

  constructor(private http: HttpClient, private config: NtsState.EntityStoreConfig) {
    // Generate initial state. Note that this state does not have undefined props like the source entity state does
    const state: NtsState.EntityState<t> = Object.assign(initialEntityState, config.initialState);
    // Set default idkey to guid
    this.idKey = config.idKey || 'guid';
    // Create store, set defaults
    this.store = new EntityStore(state, {
      name: config.name || String(Math.floor(Math.random() * 10000000)),
      resettable: config.resettable || true,
      idKey: String(this.idKey),
      cache: config.cache ? config.cache : undefined,
    } as any);

    // Create query
    this.query = new QueryEntity(this.store);
    // Create data source. Add in data property
    this.select$ = this.query.select().pipe(
      map(stateSrc => {
        let data: t[] | null | undefined;
        if (this.hasData && !this.data) {
          data = stateSrc.ids.map(id => stateSrc.entities[id]);
          this.data = data;
        } else if (this.hasData && this.data) {
          data = this.data;
        }
        // Data will always be null until initial get success
        // const data: t[] | null = this.hasData ? stateSrc.ids.map(id => stateSrc.entities[id]) : null;
        return Object.assign({}, stateSrc, { data: data });
      }),
    );

    // Create select all query that accepts default akita parameters
    this.selectAll$ = (
      select?:
        | SelectAllOptionsA<t>
        | SelectAllOptionsB<t>
        | SelectAllOptionsC<t>
        | SelectAllOptionsD<t>
        | SelectAllOptionsE<t>,
    ) => {
      return this.query.selectAll({ ...select }).pipe(
        switchMap(entities =>
          this.query.select().pipe(
            map(stateSrc => {
              const stateNew: NtsState.EntityState<t, any> = {
                ...initialEntityState,
                entities: {},
                ids: entities.map(entity => (<any>entity)[this.idKey]),
                // Data will always be null or undefined until initial get success
                data: entities,
              };
              entities.forEach(entity => stateNew[(<any>entity)[this.idKey]]);
              return Object.assign({}, stateSrc, stateNew);
            }),
          ),
        ),
      );
    };
  }

  /**
   * Get entities and load into store
   * By default requests are cached and subsequent requests are ignored unless refresh is specified
   * Subs may need to act on successful api response and 'return this.query.selectAll()' will return immediately
   * @param options
   */
  public get(options?: NtsState.Options): Observable<t[]> {
    // If not cached or refresh cache is set or a get request is already active, make http call and load store
    if (!this.httpGet$ || !this.query.getHasCache() || (options && options.refreshCache)) {
      applyTransaction(() => {
        this.store.setLoading(true);
        this.store.setError(null);
        this.store.update({ errorModify: false });
      });

      // Get default api URL
      let apiUrl = this.config.apiUrl;
      // If url specified as an argument, use that one
      if (options && options.apiUrl) {
        apiUrl = options.apiUrl;
        // Else check for a custom url override
      } else if (this.config.apiUrls && this.config.apiUrls.get) {
        apiUrl = this.config.apiUrls.get;
      }
      // Check if this is a function or a string, if function resolve the method to return a string
      const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl(null) : apiUrl; // Null to make TS happy, no payload to pass
      if (!apiUrlResolved) {
        console.error('Please supply an api url for this action');
        return throwError(null);
      }
      const httpRequest = !isObservable<string>(apiUrlResolved)
        ? this.http.get<t[]>(apiUrlResolved)
        : apiUrlResolved.pipe(switchMap(path => this.http.get<t[]>(path)));
      // If instance of get hasn't been created yet, add as a single instance with resolved api url
      this.httpGet$ = httpRequest.pipe(
        tap(entities => {
          this.hasData = true;
          this.data = null;
          const result: t[] = this.config.map && this.config.map.get ? this.config.map.get(entities) : entities;
          this.store.set(result);
        }),
        catchError(err => {
          applyTransaction(() => {
            this.store.setLoading(false);
            this.store.setError(err);
          });
          return throwError(err);
        }),
        take(1), // Ensure http request only fires once since the memory reference is stored
        share(), // If multiple components are requesting data at the same time, share the stream to avoid multiple http requests
      );
      // Make get request
      return this.httpGet$;
    }
    // No request pending or cache refresh forced, just return the store data
    return this.httpGet$;
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public post(entity: Partial<t> | Partial<t>[], options?: NtsState.Options) {
    // Get default api URL
    let apiUrl = this.config.apiUrl;
    // If url specified as an argument, use that one
    if (options && options.apiUrl) {
      apiUrl = options.apiUrl;
      // Else check for a custom url override
    } else if (this.config.apiUrls && this.config.apiUrls.post) {
      apiUrl = this.config.apiUrls.post;
    }
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl(entity) : apiUrl;
    if (!apiUrlResolved) {
      console.error('Please supply an api url for this action');
      return throwError(null);
    }
    // Check if api url is observable
    const httpRequest = !isObservable<string>(apiUrlResolved)
      ? this.http.post<Partial<t>>(apiUrlResolved, entity)
      : apiUrlResolved.pipe(switchMap(path => this.http.post<Partial<t>>(path, entity)));
    // If a map from the api response is needed
    const mapped = this.config.map && this.config.map.post ? this.config.map.post : null;
    return this.upsert(httpRequest, entity, mapped);
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public put(entity: Partial<t> | Partial<t>[], options?: NtsState.Options) {
    const key: keyof Partial<t> = this.idKey as keyof Partial<t>;
    // Get default api URL
    let apiUrl = this.config.apiUrl;
    // If url specified as an argument, use that one
    if (options && options.apiUrl) {
      apiUrl = options.apiUrl;
      // Else check for a custom url override
    } else if (this.config.apiUrls && this.config.apiUrls.put) {
      apiUrl = this.config.apiUrls.put;
    }
    // Append the unique ID to the http request unless appendID for PATCH was set to false
    // If an array was supplied, grab ID from the first entity (edge case)
    const entityId =
      this.config.disableAppendId && this.config.disableAppendId.put
        ? ''
        : '/' + (!Array.isArray(entity) ? entity[key] : entity[0][key]);
    // Hold final http request, may be null if no conditions match
    let httpRequest: Observable<Partial<t>> | null = null;
    // If type is string
    if (typeof apiUrl === 'string') {
      httpRequest = this.http.put<Partial<t>>(apiUrl + entityId, entity);
      // If type is function
    } else if (typeof apiUrl === 'function') {
      httpRequest = this.http.put<Partial<t>>(apiUrl(entity) + entityId, entity);
      // If type is observable
    } else if (isObservable<string>(apiUrl)) {
      httpRequest = apiUrl.pipe(switchMap(path => this.http.put<Partial<t>>(path + entityId, entity)));
    } else {
      console.error('Please supply an api url for PUT');
      return throwError(null);
    }
    // If a map from the api response is needed
    const mapped = this.config.map && this.config.map.put ? this.config.map.put : null;
    return this.upsert(httpRequest, entity, mapped);
  }

  /**
   * Create/Update new entity via PATCH
   * @param entity - Payload to pass to web api
   * @param url - Custom override for url path
   */
  public patch(entity: Partial<t> | Partial<t>[], options?: NtsState.Options) {
    const key: keyof Partial<t> = this.idKey as keyof Partial<t>;
    // Get default api URL
    let apiUrl = this.config.apiUrl;
    // If url specified as an argument, use that one
    if (options && options.apiUrl) {
      apiUrl = options.apiUrl;
      // Else check for a custom url override
    } else if (this.config.apiUrls && this.config.apiUrls.patch) {
      apiUrl = this.config.apiUrls.patch;
    }
    // Append the unique ID to the http request unless appendID for PATCH was set to false
    // If an array was supplied, grab ID from the first entity (edge case)
    const entityId =
      this.config.disableAppendId && this.config.disableAppendId.patch
        ? ''
        : '/' + (!Array.isArray(entity) ? entity[key] : entity[0][key]);
    // Hold final http request, may be null if no conditions match
    let httpRequest: Observable<Partial<t>> | null = null;
    // If type is string
    if (typeof apiUrl === 'string') {
      httpRequest = this.http.patch<Partial<t>>(apiUrl + entityId, entity);
      // If type is function
    } else if (typeof apiUrl === 'function') {
      httpRequest = this.http.patch<Partial<t>>(apiUrl(entity) + entityId, entity);
      // If type is observable
    } else if (isObservable<string>(apiUrl)) {
      httpRequest = apiUrl.pipe(switchMap(path => this.http.patch<Partial<t>>(path + entityId, entity)));
    } else {
      console.error('Please supply an api url for PATCH');
      return throwError(null);
    }
    // If a map from the api response is needed
    const mapped = this.config.map && this.config.map.patch ? this.config.map.patch : null;
    return this.upsert(httpRequest, entity, mapped);
  }

  /**
   * Perform an upsert. Takes an http post/put/patch type and performs an upsert on the result
   * @param request
   * @param entity
   */
  public upsert(request: Observable<Partial<t>>, entity: Partial<t> | Partial<t>[], mapped: ((x: any) => any) | null) {
    this.store.update({ modifying: true, errorModify: false });
    return request.pipe(
      tap(res => {
        // If web api response is nill, default to supplied entity
        let result = res === null || res === undefined ? <t | t[]>entity : res;
        // If string returned, it is the unique ID and replace the entity property for that
        if (typeof res === 'string') {
          (<any>result)[this.idKey] = res; // TODO: Fix any
          // Object is returned, merge response with entity supplied. Response takes priority
        } else if (typeof res === 'object' && !Array.isArray(res)) {
          result = Object.assign(entity, res);
        }
        // If map function pass result through that
        result = mapped ? mapped(result) : result;
        // Convert to array
        const resultArray = !Array.isArray(result) ? [result] : result;

        // Extract unique Ids
        // const ids: string[] = result.map(x => (<any>x)[this.config.idKey]); // TODO: Fix any
        applyTransaction(() => {
          this.data = null;
          this.store.upsertMany(resultArray);
          this.store.update({ modifying: false, errorModify: false });
        });
      }),
      catchError(err => {
        this.store.update({ modifying: false, errorModify: err });
        return throwError(err);
      }),
    );
  }

  /**
   * Delete entity
   * @param entity
   */
  public delete(entity: string | number | Partial<t>, options?: NtsState.Options) {
    const id: keyof Partial<t> = this.idKey as keyof Partial<t>;
    // const id: keyof Partial<t> = <any>this.idKey; // @Todo: Type without any
    const key = typeof entity === 'string' || typeof entity === 'number' ? entity : entity[id];
    // Get default api URL
    let apiUrl = this.config.apiUrl;
    // If url specified as an argument, use that one
    if (options && options.apiUrl) {
      apiUrl = options.apiUrl;
      // Else check for a custom url override
    } else if (this.config.apiUrls && this.config.apiUrls.delete) {
      apiUrl = this.config.apiUrls.delete;
    }
    // Append the unique ID to the http request unless appendID for PATCH was set to false
    // If an array was supplied, grab ID from the first entity (edge case)
    const entityId =
      this.config.disableAppendId && this.config.disableAppendId.delete
        ? ''
        : '/' + (!Array.isArray(entity) ? key : entity[0][id]);
    // Hold final http request, may be null if no conditions match
    let httpRequest: Observable<Partial<t>> | null = null;
    // If type is string
    if (typeof apiUrl === 'string') {
      httpRequest = this.http.delete<Partial<t>>(apiUrl + entityId);
      // If type is function
    } else if (typeof apiUrl === 'function') {
      httpRequest = this.http.delete<Partial<t>>(apiUrl(entity) + entityId);
      // If type is observable
    } else if (isObservable<string>(apiUrl)) {
      httpRequest = apiUrl.pipe(switchMap(path => this.http.delete<Partial<t>>(path + entityId)));
    } else {
      console.error('Please supply an api url for DELETE');
      return throwError(null);
    }

    return httpRequest.pipe(
      tap(() => {
        applyTransaction(() => {
          this.data = null;
          this.store.remove(key);
          this.store.update({ modifying: false, errorModify: false });
        });
      }),
      catchError(err => {
        applyTransaction(() => {
          this.store.setError(err);
          this.store.update({ modifying: false, errorModify: err });
        });
        return throwError(err);
      }),
    );
  }

  /**
   * Reset store
   */
  public reset() {
    if (!this.store || !this.query) {
      throwError(null);
    }
    this.store.reset();
  }
}

/**
 * Generate a new entity store. File is curried so use generateEntityStore(this.http)({ idKey: 'guid', apiUrl: '/api/v1/documents' })
 * @param http
 * @param config
 */
export const NtsCreateEntityStore = (http: HttpClient) => <t>(config: NtsState.EntityStoreConfig) =>
  new NtsEntityStore<t>(http, config);
