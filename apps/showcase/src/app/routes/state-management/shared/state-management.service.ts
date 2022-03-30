import { Injectable } from '@angular/core';
import { NtsStateManagementService } from '@ntersol/state-management';
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
  private store = this.sms.createBaseStore({ apiUrlBase: '//jsonplaceholder.typicode.com' });
  // Create an instance of an entity based store. Inherits configuration from base store
  public users = this.store<Models.User>({ uniqueId: 'id', storeId: StoreIds.USERS, apiUrl: '/users' });
  // Create an instance of a non-entity based store. Inherits configuration from base store
  public post = this.store<Models.Post>({ apiUrl: '/posts/1' });
  // Create a UI Store
  public uiStore = this.sms.createUIStore<UIStoreModel>({ name: null, user: { age: 12, nameFirst: 'NameFirst123' } }, { persistId: 'uiStore' });

  constructor(public sms: NtsStateManagementService) {

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
    // this.sms.dispatch(({ storeId: StoreIds.USERS, type: ApiActions.POST, payload: { name: 'Jerrol!' } })
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.POST, payload: { name: 'Jerrol!' } });
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.PUT, payload: { name: 'WINNING', id: 5 } });
    // ntsBaseStore().dispatch({ storeId: StoreIds.USERS, type: ApiActions.DELETE, payload: { id: 4 } });
  }, 2000);
   */
    // this.users.events$.subscribe(x => console.log('User store events', x));
    // ntsBaseStore().events$.subscribe(x => console.log('Global store events', x));
  }
}
