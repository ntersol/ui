import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiHttpService, ApiStatusActions } from '@mello-labs/api-tools';
import 'rxjs/add/observable/throw';

import { AppSettings, AppStore } from '@shared';
import { ApiMap } from './api.map';
import { ApiActions } from './api.actions';

import { User } from '@models';

@Injectable()
export class ApiService extends ApiHttpService {

  // API endpoints
  /** Users endpoint */
  public users = {
    get: (update?: boolean) => this.getStore<User[]>(ApiMap.users.endpoint, ApiMap.users, update),
    getOne: (user: User, update?: boolean) => this.getStore<User>(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, update),
    post: (user: User) => this.postStore<User>(ApiMap.users.endpoint, ApiMap.users, user),
    put: (user: User) => this.putStore<User>(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
    delete: (user: User) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
  };

  // Store selectors
  /** Users store selection */
  public users$ = this.store.select(store => store.api.users);
  /** Get the API state using api props */
  public getState$ = (apiProp: ApiActions) => this.store.select(store => store.apiStatus[apiProp]);
  /** Get the API data using api props */
  public getData$ = (apiProp: ApiActions) => this.store.select(store => store.api[apiProp]);

  constructor(
    private store: Store<AppStore.Root>,
    private http: HttpClient,
    private router: Router,
    private settings: AppSettings,
  ) {
    super(<any>http, <any>store, <any>router);

    // Output store changes to console
    // this.store.subscribe(store => console.log(JSON.parse(JSON.stringify(store))));
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
   * Fix a big with TS where super calls don't count as usage
   */
  public fixTS() {
    console.log(this.http, this.router, this.settings)
  }
}
