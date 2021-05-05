import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiActions, ntsApiStoreCreator, ntsBaseStore } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

export enum StoreIds {
  USERS = 'USERS',
}

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  // Create a curried store creator instance with default settings
  private store = ntsApiStoreCreator(this.http, { apiUrlBase: '//jsonplaceholder.typicode.com' });
  // Create an instance of an entity based store
  public users = this.store<Models.User>({ uniqueId: 'id', storeId: StoreIds.USERS, apiUrl: '/users' });
  // Create an instance of a non-entity based store
  public post = this.store<Models.Post>({ apiUrl: '/posts/1' }, false);

  // List all store services here
  constructor(public http: HttpClient) {
    setTimeout(() => this.users.dispatch({ storeId: StoreIds.USERS, type: ApiActions.REFRESH, payload: null }), 2000);

    ntsBaseStore().events$.subscribe(x => console.log(x));
  }
}
