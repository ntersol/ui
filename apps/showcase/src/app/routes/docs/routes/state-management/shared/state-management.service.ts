import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStore, ntsApiStore4 } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  private store = ntsApiStore(this.http, { apiUrlPrepend: '//jsonplaceholder.typicode.com' });

  public users = this.store<Models.User>({ uniqueId: 'id', apiUrl: '/users', isEntityStore: true });

  public post = this.store<Models.User>({ apiUrl: '/posts/1' });

  private store2 = ntsApiStore4(this.http, { apiUrlPrepend: '//jsonplaceholder.typicode.com' });
  public users2 = this.store2<Models.User>({ uniqueId: 'id', apiUrl: '/users' }, false);
  public users3 = this.store2<Models.User>({ uniqueId: 'id', apiUrl: '/users' }, true);

  // List all store services here
  constructor(public http: HttpClient) {
    this.users2.state$.subscribe(x => console.warn(x));
  }

  /**
   * Reset all stores
   */
  public resetAll() {
    Object.keys(this).forEach(key => {
      const dependency = (<any>this)[key];
      if (dependency && dependency.store && dependency.store.reset) {
        dependency.store.reset();
      }
    });
  }
}
