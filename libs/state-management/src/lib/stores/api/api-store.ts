import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsState } from "../../state.models";
import { NtsApiStoreCreator } from "./api-store-creator";
import { mergeConfig } from './api-store.utils';

const initialState: NtsState.ApiState<any> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    data: null,
};

export class NtsApiStore<t> extends NtsApiStoreCreator<t> {

    /** Global store config config, contains mashup of all instances. Below is the default config */
    protected config: NtsState.Config = {
        autoLoad: true,
    };

    /** Select a smaller subset of data from the store
     *
     * TODO:
     */
    public select$ = this.state$.pipe(
        map((s) => s.data),
        distinctUntilChanged(),
    );

    constructor(http: HttpClient, config: NtsState.Config,) {
        super(http, config, initialState, false);
        // Merge all configs into single entity
        this.config = mergeConfig(this.config, config);
    }

}