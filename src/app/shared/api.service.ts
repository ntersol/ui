import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs";

import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { IStore, StoreActionsApi, ApiMap } from '@shared';
import { BaseApiStore } from './_base/api.base.store.service';
import { ApiSelectors } from './stores/api/api.selectors';
import { Store } from '@ngrx/store';


@Injectable()
export class ApiService extends BaseApiStore {


    constructor(
        private httpSvc: Http,
        private storeSvc: Store<IStore.root>,
        private routerSvc: Router,
        public select: ApiSelectors
    ) {
        super(httpSvc, storeSvc, routerSvc);
     
	  }


    /*
    //public user = (update?: boolean) => this.getStore(ApiMap.user.endpoint + 'getuserprofile/', ApiMap.user, update);
    public user = {
        getMyProfile: (update?: boolean) => this.getStore(ApiMap.user.endpoint + 'getuserprofile/', ApiMap.user, update),
        getOtherProfile: (userId: string, update?: boolean) => this.getStore(ApiMap.user.endpoint + 'user/' + userId, ApiMap.user, update),
        getAllUsers: (): Observable<string[]> => this.get(window.localStorage.webApiUrl + '/' + ApiMap.user.endpoint + 'getall/'),
        impersonate: (password: string, userToImpersonate) => this.post(window.localStorage.webApiUrl + '/' + ApiMap.user.endpoint + 'authenticateimpersonation', { password: password, userToImpersonate: userToImpersonate }),
        stopImpersonate: () => this.delete(window.localStorage.webApiUrl + '/' + ApiMap.user.endpoint + 'stopimpersonating', null)
    }
    */


    /**
     * Reset all errors in the api state
    */
	  public resetErrors(): void {
		  this.storeSvc.dispatch({
			  type: StoreActionsApi.RESET_ERRORS,
			  payload: null
		  });// Update store with new state
	  }
     
    /**
     * Reset all errors in the api state
     */
	  public resetSuccess(): void {
		  this.storeSvc.dispatch({
			  type: StoreActionsApi.RESET_SUCCESS,
			  payload: null
		  });// Update store with new state
	  }
    
}
