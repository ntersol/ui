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
    // Single store call
    //public users$ = this.store.select(store => store.api.users);

    /** Users store selection */
	public users$ = this.store.select(store => store.api.users);

	/** Get the API state using api props */
	public getState$ = (apiProp: ApiProps): Observable<IStore.ApiStatus> => this.store.select(store => store.apiStatus[apiProp]);
    /** Get the API data using api props */
	public getData$ = (apiProp: ApiProps): Observable<any> => this.store.select(store => store.api[apiProp]);

    constructor(
        private store: Store<IStore.root>
	) {
        // Output store contents
		//this.store.select(store => store.api).subscribe(res => console.log('Store API State ', res));
		//this.store.select(store => store.apiStatus).subscribe(res => console.log('Store API Status State ', res));
		//this.store.select(store => store.ui).subscribe(res => console.log('Store UI State ', res));
    }
}
