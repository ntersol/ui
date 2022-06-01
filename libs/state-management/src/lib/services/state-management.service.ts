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
  /**
   * Listen to global events
   */
  public events$ = ntsStore.events$;

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
  public createBaseStore = ((configBase: NtsState.Config | NtsState.ConfigEntity) =>
    <t>(config: NtsState.Config | NtsState.ConfigEntity<t>) => {
      // Merge base config with specific store config
      const c: NtsState.Config | NtsState.ConfigEntity<t> = config ? mergeConfig(configBase, config) : config;
      // If a uniqueID is specified, return an entity store. If not return an api store
      return is.entityConfig(c) ? this.createEntityStore<t>(c) : this.createApiStore<t>(c);
    }) as (
    configBase: NtsState.Config | NtsState.ConfigEntity,
  ) => (<t>(config: NtsState.Config) => NtsApiStore<t>) & (<t>(config: NtsState.ConfigEntity<t>) => NtsEntityStore<t>);

  /**
   * Create an entity based api store
   * @param config Configuration for this store
   * @returns
   */
  public createEntityStore = <t>(config: NtsState.ConfigEntity<t>) => new NtsEntityStore<t>(this.http, config);

  /**
   * Create a non-entity based api store
   * @param config Configuration for this store
   * @returns
   */
  public createApiStore = <t>(config: NtsState.Config) => new NtsApiStore<t>(this.http, config);

  /**
   *
   * @param initialState
   * @param options
   * @returns
   */
  public createUIStore = <t>(initialState: t, options?: NtsState.UIStoreOptions) =>
    new NtsUIStoreCreator<t>(initialState, options);

  constructor(private http: HttpClient) {}

  /**
   * Dispatch an action to all stores
   */
  public dispatch(action: NtsState.Action<unknown, unknown> | NtsState.ApiAction<unknown>) {
    ntsStore.dispatch(action);
  }
}
