import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStoreCreator, ntsUIStoreCreator, NtsApiStoreCreatorNew } from '@ntersol/state-management';
import { Models } from '../../../shared/models';

export enum StoreIds {
  USERS = 'USERS',
}

interface UIStoreModel {
  name: string | null;
  user?: {
    nameFirst: string | null;
    age: number;
  };
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
  // public post = this.store<Models.Post>({ apiUrl: '/posts/1' }, false);

  public uiStore = ntsUIStoreCreator<UIStoreModel>({ name: null, user: { age: 12, nameFirst: 'NameFirst123' } }, { persistId: 'uiStore' });


  private storeCreator = this.store2.createBaseStore({ apiUrlBase: '//jsonplaceholder.typicode.com' });
  private apiStore = this.storeCreator<Models.User>({ uniqueId: 'id', storeId: StoreIds.USERS, apiUrl: '/users' });
  private apiStore2 = this.storeCreator<Models.User>({ storeId: StoreIds.USERS, apiUrl: '/users' });

  // List all store services here
  constructor(public http: HttpClient, public store2: NtsApiStoreCreatorNew) {
    this.apiStore.selectAll$.subscribe(users => {

    });
    this.apiStore2.select$.subscribe(user => {

    })
    /**
    this.uiStore.select$('isString').subscribe(x => console.log(x));

    this.uiStore
      .update(() => ({ isString: 'Winning!' }))
      .then(s => {
        console.log(1, s);
      });
       */

    /**
  setTimeout(() => {
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.POST, payload: { name: 'Jerrol!' } });
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.PUT, payload: { name: 'WINNING', id: 5 } });
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.DELETE, payload: { id: 4 } });
  }, 2000);
   */
    // this.users.events$.subscribe(x => console.log('User store events', x));
    // ntsBaseStore().events$.subscribe(x => console.log('Global store events', x));
  }
}
