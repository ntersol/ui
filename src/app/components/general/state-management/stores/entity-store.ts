import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap, share, take } from 'rxjs/operators';
import { throwError, Observable, isObservable } from 'rxjs';
import { applyTransaction, EntityStore, QueryEntity, SelectAllOptionsB } from '@datorama/akita';
import { initialEntityState } from '../utils/initialState';
import { NtsState } from '..';

/**
 * Dynamically created an Akita store for entities
 */
export class NtsEntityStore<t> {
  public store: EntityStore<NtsState.EntityState<t, any>, any, any>; // TODO: Type this better
  public query: QueryEntity<NtsState.EntityState<t, any>, any, any>; // TODO: Type this better
  /** Select the store state and all entities */
  public select$: Observable<NtsState.EntityState<t, any>>;
  /** Select the store state and a subset of entities using Akita's standard query parameters for selectAll */
  public selectAll$: (select: SelectAllOptionsB<t>) => Observable<NtsState.EntityState<t, any>>;

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
    this.selectAll$ = (select: SelectAllOptionsB<t>) => {
      return this.query.selectAll(select).pipe(
        switchMap(entities =>
          this.query.select().pipe(
            map(stateSrc => {
              const stateNew: Partial<NtsState.EntityState<t, t>> = {
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
   * @param refreshCache Force refresh of data in store
   */
  public get(refreshCache = false): Observable<t[]> {
    // If not cached or refresh cache is set or a get request is already active, make http call and load store
    if (refreshCache || !this.query.getHasCache()) {
      applyTransaction(() => {
        this.store.setLoading(true);
        this.store.setError(null);
        this.store.update({ errorModify: false });
      });
      // Check if this is the default apiUrl or a custom get url
      const apiUrl = this.config.apiUrls && this.config.apiUrls.get ? this.config.apiUrls.get : this.config.apiUrl;
      // Check if this is a function or a string, if function resolve the method to return a string
      const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;

      if (!apiUrlResolved) {
        console.error('Please supply an api url for this action');
        return throwError(null);
      }

      const httpRequest = !isObservable<string>(apiUrlResolved)
        ? this.http.get<t[]>(apiUrlResolved)
        : apiUrlResolved.pipe(switchMap(url => this.http.get<t[]>(url)));

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
        share(),
      );

      // Make get request
      return this.httpGet$;
    }
    // No request pending or cache refresh forced, just return the store data
    return this.query.selectAll().pipe(take(1));
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public post(entity: Partial<t> | Partial<t>[]) {
    // Check if this is the default apiUrl or a custom get url
    const apiUrl = this.config.apiUrls && this.config.apiUrls.post ? this.config.apiUrls.post : this.config.apiUrl;
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
    if (!apiUrlResolved) {
      console.error('Please supply an api url for this action');
      return throwError(null);
    }
    // Check if api url is observable
    const httpRequest = !isObservable<string>(apiUrlResolved)
      ? this.http.post<Partial<t>>(apiUrlResolved, entity)
      : apiUrlResolved.pipe(switchMap(url => this.http.post<Partial<t>>(url, entity)));

    // If a map from the api response is needed
    const mapped = this.config.map && this.config.map.post ? this.config.map.post : null;
    return this.upsert(httpRequest, entity, mapped);
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public put(entity: Partial<t> | Partial<t>[]) {
    const key: keyof Partial<t> = <any>this.idKey; // @Todo: Type without any
    // Get the api url, either the default global one or a custom one for this verb
    const apiUrl = this.config.apiUrls && this.config.apiUrls.put ? this.config.apiUrls.put : this.config.apiUrl;
    // Determine if an additional slug (usually the guid or id) needs to be appended to this request
    // An additional slug is never appended to a custom url and must be added by the input source
    const entitySlug =
      this.config.apiUrls && this.config.apiUrls.patch
        ? null
        : '/' + (!Array.isArray(entity) ? entity[key] : entity[0][key]);

    // Hold final http request, may be null if no conditions match
    let httpRequest: Observable<Partial<t>> | null = null;
    // If type is string
    if (typeof apiUrl === 'string') {
      const slug = entitySlug ? apiUrl + entitySlug : apiUrl; // Only append slug if NOT custom
      httpRequest = this.http.put<Partial<t>>(slug, entity);
      // If type is function
    } else if (typeof apiUrl === 'function') {
      const slug = entitySlug ? apiUrl() + entitySlug : apiUrl; // Only append slug if NOT custom
      httpRequest = this.http.put<Partial<t>>(slug, entity);
      // If type is observable
    } else if (isObservable<string>(apiUrl)) {
      httpRequest = apiUrl.pipe(
        switchMap(url => {
          const slug = entitySlug ? url + entitySlug : url; // Only append slug if NOT custom
          return this.http.put<Partial<t>>(slug, entity);
        }),
      );
    } else {
      console.error('Please supply an api url for PUT');
      return throwError(null);
    }

    // If a map from the api response is needed
    const mapped = this.config.map && this.config.map.put ? this.config.map.put : null;
    return this.upsert(httpRequest, entity, mapped);
  }

  /**
   * Create new entity via post
   * @param entity
   */
  public patch(entity: Partial<t> | Partial<t>[]) {
    const key: keyof Partial<t> = <any>this.idKey; // @Todo: Type without any
    // Get the api url, either the default global one or a custom one for this verb
    const apiUrl = this.config.apiUrls && this.config.apiUrls.patch ? this.config.apiUrls.patch : this.config.apiUrl;
    // Determine if an additional slug (usually the guid or id) needs to be appended to this request
    // An additional slug is never appended to a custom url and must be added by the input source
    const entitySlug =
      this.config.apiUrls && this.config.apiUrls.patch
        ? null
        : '/' + (!Array.isArray(entity) ? entity[key] : entity[0][key]);

    // Hold final http request, may be null if no conditions match
    let httpRequest: Observable<Partial<t>> | null = null;
    // If type is string
    if (typeof apiUrl === 'string') {
      const slug = entitySlug ? apiUrl + entitySlug : apiUrl; // Only append slug if NOT custom
      httpRequest = this.http.patch<Partial<t>>(slug, entity);
      // If type is function
    } else if (typeof apiUrl === 'function') {
      const slug = entitySlug ? apiUrl() + entitySlug : apiUrl; // Only append slug if NOT custom
      httpRequest = this.http.patch<Partial<t>>(slug, entity);
      // If type is observable
    } else if (isObservable<string>(apiUrl)) {
      httpRequest = apiUrl.pipe(
        switchMap(url => {
          const slug = entitySlug ? url + entitySlug : url; // Only append slug if NOT custom
          return this.http.patch<Partial<t>>(slug, entity);
        }),
      );
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
  public delete(entity: string | number | Partial<t>) {
    const id: keyof Partial<t> = <any>this.idKey; // @Todo: Type without any
    const key = typeof entity === 'string' || typeof entity === 'number' ? entity : entity[id];
    this.store.update({ modifying: true, errorModify: false });
    // Check if this is the default apiUrl or a custom get url
    const apiUrl = this.config.apiUrls && this.config.apiUrls.delete ? this.config.apiUrls.delete : this.config.apiUrl;
    // Check if this is a function or a string, if function resolve the method to return a string
    const apiUrlResolved = typeof apiUrl === 'function' ? apiUrl() : apiUrl + '/' + key;

    // Check if api url is observable
    const httpRequest = !isObservable<string>(apiUrlResolved)
      ? this.http.delete<Partial<t>>(apiUrlResolved)
      : apiUrlResolved.pipe(switchMap(url => this.http.delete<Partial<t>>(url)));

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
      return throwError(null);
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
