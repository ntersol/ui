import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppStore } from '$shared';
import { Models } from '$models';

import { ApiHttpService } from '../http.base.service';
import { ApiSelectorsService } from './api.selectors.service';
import { ApiStatusActions } from './api.actions';
import { ApiMap } from './api.map';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends ApiHttpService {

  /** Users endpoint */
  public users = {
    get: (update?: boolean) => this.getStore<Models.User[]>(ApiMap.users.endpoint, ApiMap.users, update),
    post: (user: Models.User) => this.postStore<Models.User>(ApiMap.users.endpoint, ApiMap.users, user),
    put: (user: Models.User) => this.putStore<Models.User>(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
    delete: (user: Models.User) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
  };

  constructor(
    private store: Store<AppStore.Root>,
    private http: HttpClient,
    private router: Router,
    /** API Store Selectors */
    public select: ApiSelectorsService,
  ) {
    super(<any>http, <any>store, <any>router);

    // Output store changes to console
    this.store.subscribe(storeApi => console.log(JSON.parse(JSON.stringify(storeApi.api))));
  }

  /**
   * Reset the store, clear out all held state and data
   */
  public resetStore() {
    this.cache = {}; // Clear cache
    this.store.dispatch({
      type: ApiStatusActions.RESET,
      payload: null,
    }); // Update store with new state
  }

  /**
   * Reset all errors in the api state
   */
  public resetErrors(): void {
    this.store.dispatch({
      type: ApiStatusActions.RESET_ERRORS,
      payload: null,
    });
  }

  /**
   * Reset all errors in the api state
   */
  public resetSuccess(): void {
    this.store.dispatch({
      type: ApiStatusActions.RESET_SUCCESS,
      payload: null,
    });
  }

  /**
   * Fix a bug with TS where super calls don't count as usage
   */
  public fixTS() {
    console.log(this.http, this.router);
  }
}
