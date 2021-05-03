import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsCreateEntityStore } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  private store = ntsCreateEntityStore(this.http);

  public users = this.store<Models.User>({ idKey: 'id', apiUrl: '//jsonplaceholder.typicode.com/users' });

  // List all store services here
  constructor(public http: HttpClient) {}

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
