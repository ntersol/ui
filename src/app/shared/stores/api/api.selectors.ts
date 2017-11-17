import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStore, ApiMap, ApiProps } from '@shared';// HttpClient, 
import { Observable, BehaviorSubject } from "rxjs";


@Injectable()
export class ApiSelectors {
    //Sample Slices
    //public getPipelineView = (): Observable<PipelineView> => Observable.combineLatest(
    //  this.store.select(store => store.api.pipeline),
    //  this.store.select(store => store.api.defaultLayout),
    //  (pipeline, defaultLayout) => ({ pipeline, defaultLayout })
    //);
    //public currentLayout = (): Observable<M4Pipe.Layout> => this.store.select(store => store.api.defaultLayout);
  

    /** Get a combined observable of the store state and data */
    public getDataState = (apiProp: ApiProps): Observable<IStore.DataState> => Observable.combineLatest(
        this.store.select(store => store.api[apiProp]),
        this.store.select(store => store.api._state[apiProp]),
        (data, state) => ({ data, state })
    );
    /** Get the API state but not data */
    public getState = (apiProp: string): Observable<IStore.ApiStatus> => this.store.select(store => store.api._state[apiProp]);
    /** Get the data but not API state */
	  public getData = (apiProp: string): Observable<any> => this.store.select(store => store.api[apiProp]);
    

    constructor(
        private store: Store<IStore.root>
    ) {
    }
}
