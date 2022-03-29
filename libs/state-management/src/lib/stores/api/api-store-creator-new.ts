import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NtsState } from "../../state.models";
import { NtsApiStore } from './api-store';
import { is, mergeConfig } from './api-store.utils';
import { NtsEntityStore } from './entity-store';


type Config = NtsState.Config | NtsState.ConfigEntity;

type IOverload = {
  <t>(config: NtsState.Config): NtsApiStore<t>;
  <t>(config: NtsState.ConfigEntity): NtsEntityStore<t>;
}


@Injectable({
  providedIn: 'root',
})
export class NtsApiStoreCreatorNew {

  public createBaseStore = (configBase: Config) => <t>(config: Config): IOverload => {
    const c: Config = !!config ? mergeConfig(configBase, config) : config;
    return is.entityConfig(c) ? this.createEntityStore<t>(c) : this.createApiStore<t>(c);
  };

  public createEntityStore = <t>(config: NtsState.ConfigEntity) => new NtsEntityStore<t>(this.http, config);

  public createApiStore = <t>(config: NtsState.Config) => new NtsApiStore<t>(this.http, config);


  constructor(private http: HttpClient) { }

  /**
   *
   * @param config
   * @returns
   */
  public createBaseStore2(config: NtsState.Config | NtsState.ConfigEntity) {

    if (is.entityConfig(config)) {
      return this._createEntityStore
    }

    return this.temp(config);
  }

  public createEntityStore2(config: NtsState.ConfigEntity) {
    return this._createEntityStore(config);
  }

  private _createEntityStore<t>(config: NtsState.ConfigEntity, configBase?: NtsState.Config) {
    const c = !!configBase ? mergeConfig(configBase, config) : config;
    return new NtsEntityStore<t>(this.http, c);
  }

  private _createApiStore<t>(config: NtsState.Config) {
    return new NtsApiStore<t>(this.http, config)
  }

  /**
   *
   * @param config
   * @param isEntityStore
   */
  private createStore<t>(config: NtsState.Config, configBase: NtsState.Config): NtsApiStore<t>;
  private createStore<t>(config: NtsState.ConfigEntity, configBase: NtsState.Config): NtsEntityStore<t>;
  private createStore<t>(config: NtsState.Config | NtsState.ConfigEntity, configBase: NtsState.Config) {
    const c: NtsState.Config | NtsState.ConfigEntity = !!config ? mergeConfig(configBase, config) : config;
    return is.entityConfig(c) ? new NtsEntityStore<t>(this.http, c) : new NtsApiStore<t>(this.http, c);
  }

  public temp(config1: NtsState.Config | NtsState.ConfigEntity = {}) {

    /**
    function gimmeStore<t>(config2: NtsState.Config | NtsState.ConfigEntity) {
      return this.createStore<t>(config1, config2);
    }
    return gimmeStore;
     */

    /** */
    return <t>(config2: NtsState.Config | NtsState.ConfigEntity) => {
      return this.createStore<t>(config1, config2);
    };

  }
}
