import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsState } from "../../state.models";
import { NtsApiStoreCreator } from "./api-store-creator";
import { mergeConfig } from './api-store.utils';

const initialState: NtsState.EntityApiState<any> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    entities: {},
    data: null,
};

export class NtsEntityStore<t> extends NtsApiStoreCreator<t[]> {

    protected state: NtsState.EntityApiState<t> = { ...initialState };

    /** Global store config config, contains mashup of all instances. Below is the default config */
    protected config: NtsState.ConfigEntity = {
        autoLoad: true,
        uniqueId: 'guid'
    };

    /** Select all of the entities in the store. Does not include state. */
    public selectAll$ = this.state$.pipe(
        map((s) => s.data),
        distinctUntilChanged(),
    );

    /** Select a single entity from the store. Does not include state. */
    public selectOne$ = (uniqueId: string | number) => this.state$.pipe(
        map((s) => !!s.entities && !!s.entities[uniqueId] ? s.entities[uniqueId] as t : null),
        distinctUntilChanged(),
    );

    /**
     * Select a subset of data from the store. Does not include state.
     * TODO: This observable will fire on any data changes not just when the entities selected for are changed. Need a way to keep track of memory references
     */
    public selectSome$ = (fn: NtsState.SelectEntities<t>) => this.state$.pipe(
        map((s) => fn(s.data)),
        distinctUntilChanged(),
    );

    constructor(http: HttpClient, config: NtsState.ConfigEntity) {
        super(http, config, true);
        // Merge all configs into single entity
        this.config = mergeConfig(this.config, config);
    }

}