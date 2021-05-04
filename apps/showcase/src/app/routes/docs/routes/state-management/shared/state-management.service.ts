import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStore } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

const options = { apiUrlPrepend: '//jsonplaceholder.typicode.com' };

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  public users = ntsApiStore<Models.User>(this.http, { ...options, uniqueId: 'id', apiUrl: '/users' }, true);
  public post = ntsApiStore<Models.Post>(this.http, { ...options, apiUrl: '/posts/1' }, false);

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
