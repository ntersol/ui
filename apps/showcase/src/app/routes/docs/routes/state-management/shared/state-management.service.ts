import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStoreCreator } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  // Create a curried store creator instance with default settings
  private store = ntsApiStoreCreator(this.http, { apiUrlBase: '//jsonplaceholder.typicode.com' });
  // Create an instance of an entity based store
  public users = this.store<Models.User>({ uniqueId: 'id', apiUrl: '/users' });
  // Create an instance of a non-entity based store
  public post = this.store<Models.Post>({ apiUrl: '/posts/1' }, false);

  // List all store services here
  constructor(public http: HttpClient) {}
}
