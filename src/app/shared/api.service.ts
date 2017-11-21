import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs";

import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { IStore, ApiActions, ApiMap, ApiHttpService, ApiSelectors  } from '@shared';
import { Store } from '@ngrx/store';


@Injectable()
export class ApiService extends ApiHttpService {

    constructor(
        private httpSvc: Http,
        private storeSvc: Store<IStore.root>,
        private routerSvc: Router,
        public select: ApiSelectors
    ) {
        super(httpSvc, storeSvc, routerSvc);
	}

    /** Sample store usage */
    public users = {
	    get: (update?: boolean) => this.getStore(ApiMap.users.endpoint, ApiMap.users, update),
		getOne: (user, update?: boolean) => this.getStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, update),
	    post: (user) => this.postStore(ApiMap.users.endpoint, ApiMap.users, user),
		put: (user) => this.putStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
		delete: (user) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user)
    }

    /**
    * Reset all errors in the api state
    */
    public resetErrors(): void {
	    this.storeSvc.dispatch({
		    type: ApiActions.RESET_ERRORS,
		    payload: null
	    });// Update store with new state
    }
     
    /**
    * Reset all errors in the api state
    */
    public resetSuccess(): void {
	    this.storeSvc.dispatch({
		    type: ApiActions.RESET_SUCCESS,
		    payload: null
	    });// Update store with new state
    }
    
}
