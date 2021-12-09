import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsState } from "../../state.models";
import { NtsApiStoreCreator } from "./api-store";

const initialState: NtsState.ApiState<any> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    data: null,
};

export class NtsApiStore<t> extends NtsApiStoreCreator<t> {

    protected state: NtsState.ApiState<t> = { ...initialState };

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

    constructor(http: HttpClient, config: NtsState.Config) {
        super(http, config, true);
    }

}