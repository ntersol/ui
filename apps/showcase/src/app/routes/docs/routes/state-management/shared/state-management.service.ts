import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStoreCreator, ntsUIStoreCreator } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

export enum StoreIds {
  USERS = 'USERS',
}

interface UIStoreModel {
  temp: string;
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

  public uiStore = ntsUIStoreCreator<UIStoreModel>({ temp: '' }, { storeId: 'uiStore' });

  // List all store services here
  constructor(public http: HttpClient) {
    this.uiStore.select$('temp').subscribe(x => console.log(x));

    this.uiStore
      .update(() => ({ temp: 'Winning!' }))
      .then(s => {
        console.log(1, s.temp);
      });

    setTimeout(() => {
      // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.POST, payload: { name: 'Jerrol!' } });
      // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.PUT, payload: { name: 'WINNING', id: 5 } });
      // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.DELETE, payload: { id: 4 } });
    }, 2000);
    // this.users.events$.subscribe(x => console.log('User store events', x));
    // ntsBaseStore().events$.subscribe(x => console.log('Global store events', x));
  }
}
