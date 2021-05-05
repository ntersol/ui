import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ntsApiStore } from '@ntersol/state-management';
import { Models } from '../../../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  private store = ntsApiStore(this.http, { apiUrlBase: '//jsonplaceholder.typicode.com' });

  public users = this.store<Models.User>({ apiUrl: '/users' });
  public post = this.store<Models.Post>({ apiUrl: '/posts/1' }, false);

  // List all store services here
  constructor(public http: HttpClient) {}
}
