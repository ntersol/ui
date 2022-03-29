import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NtsState } from "../../state.models";
import { NtsApiStore } from './api-store';
import { NtsApiStoreCreator } from './api-store-creator';
import { is, mergeConfig } from './api-store.utils';
import { NtsEntityStore } from './entity-store';

@Injectable({
  providedIn: 'root',
})
export class NtsApiStoreCreatorNew {

  public config: NtsState.Config | NtsState.ConfigEntity | null = null;

  constructor(private http: HttpClient) { }

  /**
   *
   * @param config
   * @returns
   */
  public createBaseStore(config: NtsState.Config | NtsState.ConfigEntity) {
    this.config = { ...config };
    return this.createStore;
  }

  /**
   *
   * @param config
   * @param isEntityStore
   */
  public createStore<t>(config: NtsState.Config): NtsApiStore<t>;
  public createStore<t>(config: NtsState.ConfigEntity): NtsEntityStore<t>;
  public createStore<t>(config: NtsState.Config | NtsState.ConfigEntity) {
    const c: NtsState.Config | NtsState.ConfigEntity = !!this.config ? mergeConfig(this.config, config) : config;
    return is.entityConfig(c) ? new NtsEntityStore<t>(this.http, c) : new NtsApiStoreCreator<t>(this.http, c);
  }
}
