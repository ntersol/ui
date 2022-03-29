import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NtsState } from "../../state.models";
import { NtsApiStore } from './api-store';
import { is, mergeConfig } from './api-store.utils';
import { NtsEntityStore } from './entity-store';



@Injectable({
  providedIn: 'root',
})
export class NtsApiStoreCreatorNew {


  /**
   * Create a curried instance of the api store creator
   * @param configBase Default configuration for all store instances used by this creator. Will be overwritten by individual store properties
   @example
  * private store = this.storeCreator({ apiUrlBase: '//jsonplaceholder.typicode.com' })
  * @returns
   */
  public createBaseStore = ((configBase: NtsState.Config | NtsState.ConfigEntity) => <t>(config: NtsState.Config | NtsState.ConfigEntity) => {
    // Merge base config with specific store config
    const c: NtsState.Config | NtsState.ConfigEntity = !!config ? mergeConfig(configBase, config) : config;
    // If a uniqueID is specified, return an entity store. If not return an api store
    return is.entityConfig(c) ? this.createEntityStore<t>(c) : this.createApiStore<t>(c);
  }) as (configBase: NtsState.Config | NtsState.ConfigEntity) => ((<t>(config: NtsState.Config) => NtsApiStore<t>) & (<t>(config: NtsState.ConfigEntity) => NtsEntityStore<t>));

  /**
   *
   * @param config
   * @returns
   */
  public createEntityStore = <t>(config: NtsState.ConfigEntity) => new NtsEntityStore<t>(this.http, config);

  /**
   *
   * @param config
   * @returns
   */
  public createApiStore = <t>(config: NtsState.Config) => new NtsApiStore<t>(this.http, config);


  constructor(private http: HttpClient) { }
}
