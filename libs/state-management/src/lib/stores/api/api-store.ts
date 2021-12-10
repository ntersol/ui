import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsState } from "../../state.models";
import { NtsApiStoreCreator } from "./api-store-creator";

const initialState: NtsState.ApiState<any> = {
    loading: false,
    modifying: false,
    error: false,
    errorModify: false,
    data: null,
};

export class NtsApiStore<t> extends NtsApiStoreCreator<t> {

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

    }

}