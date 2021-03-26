import { Injectable } from '@angular/core';
import { StaticService } from './services/static.service';
import { HttpClient } from '@angular/common/http';
import { ntsCreateEntityStore } from 'src/app/components/general/state-management';
import { Models } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  private store = ntsCreateEntityStore(this.http);
  public users = this.store<Models.User>({ idKey: 'id', apiUrl: '//jsonplaceholder.typicode.com/users' });

  // List all store services here
  constructor(
    public http: HttpClient,
    public staticData: StaticService, // Simple webapi calls that are GET only
  ) {}

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
