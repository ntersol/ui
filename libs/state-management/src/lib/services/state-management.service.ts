import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NtsState } from '../state.models';
import { NtsUIStoreCreator } from '../stores/ui/ui-store';
import { NtsApiStore } from '../stores/api/api-store';
import { is, mergeConfig } from '../stores/api/api-store.utils';
import { NtsEntityStore } from '../stores/api/entity-store';
import { ntsStore } from '../..';

@Injectable({
  providedIn: 'root',
})
export class NtsStateManagementService {
  /** Listen to global events */
  public events$ = ntsStore.events$;

  /** Store references to all created stores  */
  private storeRefs: NtsState.StoreRef<any>[] = [];

  /**
   * Create a curried instance of the api store creator
   * @param configBase Default configuration for all store instances used by this creator. Will be overwritten by individual store properties
   * @example
   * private store = this.storeCreator({ apiUrlBase: '//jsonplaceholder.typicode.com' });
   * // An entity store
   * public users = this.store<Models.User>({ uniqueId: 'id', storeId: 'users', apiUrl: '/users' });
   * // A non-entity store
   * public post = this.store<Models.Post>({ apiUrl: '/posts/1' });
   * @returns
   */
  public createBaseStore = ((configBase: NtsState.ConfigApi | NtsState.ConfigEntity) =>
    <t>(config: NtsState.ConfigApi<t> | NtsState.ConfigEntity<t>) => {
      // Merge base config with specific store config
      const c: NtsState.ConfigApi<t> | NtsState.ConfigEntity<t> = config ? mergeConfig(configBase, config) : config;
      // If a uniqueID is specified, return an entity store. If not return an api store
      return is.entityConfig(c) ? this.createEntityStore<t>(c) : this.createApiStore<t>(c);
    }) as (
    configBase: NtsState.ConfigApi | NtsState.ConfigEntity,
  ) => (<t>(config: NtsState.ConfigApi<t>) => NtsApiStore<t>) &
    (<t>(config: NtsState.ConfigEntity<t>) => NtsEntityStore<t>);

  /**
   * Create an entity based api store
   * @param config Configuration for this store
   * @returns
   */
  public createEntityStore = <t>(config: NtsState.ConfigEntity<t>) => {
    const store = new NtsEntityStore<t>(this.http, config);
    this.storeRefs = [
      ...this.storeRefs,
      { type: 'api', storeId: config?.storeId || String(Math.floor(Math.random() * 10000000)), ref: store },
    ];
    return store;
  };

  /**
   * Create a non-entity based api store
   * @param config Configuration for this store
   * @returns
   */
  public createApiStore = <t>(config: NtsState.ConfigApi<t>) => {
    const store = new NtsApiStore<t>(this.http, config);
    this.storeRefs = [
      ...this.storeRefs,
      { type: 'api', storeId: config?.storeId || String(Math.floor(Math.random() * 10000000)), ref: store },
    ];
    return store;
  };

  /**
   *
   * @param initialState
   * @param options
   * @returns
   */
  public createUIStore = <t>(initialState: t, options?: NtsState.UIStoreOptions) => {
    const store = new NtsUIStoreCreator<t>(initialState, options);
    this.storeRefs = [
      ...this.storeRefs,
      { type: 'ui', storeId: options?.persistId || String(Math.floor(Math.random() * 10000000)), ref: store },
    ];
    return store;
  };

  constructor(private http: HttpClient) {}

  /**
   * Reset stores created by this service, can be API, UI or all
   * This is useful for clearing data on auth failures
   */
  public resetStores(type: NtsState.StoreType = 'all') {
    // If all stores, return all. If only a specific type, filter out wrong types
    const stores = type === 'all' ? this.storeRefs : this.storeRefs.filter((s) => s.type === type);
    // Reset stores
    stores.forEach((s) => s.ref.reset());
  }

  /**
   * Dispatch an action to all stores
   */
  public dispatch(action: NtsState.Action<unknown, unknown> | NtsState.ApiAction<unknown>) {
    ntsStore.dispatch(action);
  }
}
