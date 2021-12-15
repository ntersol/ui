import { HttpClient } from "@angular/common/http";
import { NtsState } from "../../state.models";
import { mergeConfig } from "./api-store.utils";
import { NtsEntityStore } from "./entity-store";
import { NtsApiStore } from "./api-store";

/**
 * Create a curried instance of the api store creator
 *
 * @example
 * private store = ntsApiStoreCreator(this.http, { apiUrlBase: '//jsonplaceholder.typicode.com' })
 * @param http A reference to Angular's http service
 * @param configBase Default configuration for all store instances used by this creator. Will be overwritten by individual store properties
 * @returns
 */
export const ntsApiStoreCreator = (http: HttpClient, configBase?: NtsState.ConfigEntity | NtsState.Config | null) => {
    // @ts-ignore : TODO: Resolve overload typings issue. Maybe :/
    const store: {
        /**
         * Create an instance of an entity based api store. Used for managing an array of objects
         * @example
         * public users = this.store<Models.User>({ apiUrl: '/users' });
         * @param config Store configuration and options
         * @param isEntityStore Should the store create and manage entities
         * @returns
         */
        <t>(config: NtsState.ConfigEntity, isEntityStore?: true): NtsEntityStore<t>;
        /**
         * Create an instance of a non-entity based api store. Used for managing all none entity types
         * @example
         * public users = this.store<Models.User>({ apiUrl: '/users' }, false);
         * @param config Store configuration and options
         * @param isEntityStore Should the store create and manage entities
         * @returns
         */
        <t>(config: NtsState.Config, isEntityStore?: false): NtsApiStore<t>;
    } = <t>(
        config: NtsState.Config | NtsState.ConfigEntity,
        isEntityStore = true,
        ) => !!isEntityStore
                ? new NtsEntityStore<t>(http, mergeConfig(configBase as NtsState.ConfigEntity || {}, config as NtsState.ConfigEntity))
                : new NtsApiStore<t>(http, mergeConfig(configBase || {}, config))
    return store;
};