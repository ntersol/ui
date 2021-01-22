import { Injectable } from '@angular/core';
import { StaticService } from './services/static.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { EntityState } from '@datorama/akita';
import { NtsCreateEntityStore } from 'src/app/components/general/state-management';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  public users = NtsCreateEntityStore(this.http)({ idKey: 'id', apiUrl: '//jsonplaceholder.typicode.com/users' });

  // List all store services here
  constructor(
    public http: HttpClient,
    public staticData: StaticService, // Simple webapi calls that are GET only
  ) {}

  /**
   * Make an single http call that returns entity format and api state
   * @param url
   * @param uniqueId
   */
  public get<t>(url: string, uniqueId?: string) {
    let state: EntityState<t, string> = {
      loading: true,
      error: false,
      ids: [],
      entities: {},
      data: null,
    };
    const response = new BehaviorSubject(state);
    this.http.get<t | t[]>(url).subscribe(
      res => {
        state = Object.assign({}, state, { data: res, loading: false });
        if (Array.isArray(res) && uniqueId) {
          res.forEach(x => {
            if (state.ids && state.entities) {
              state.ids.push((<any>x)[uniqueId]);
              state.entities[uniqueId] = x;
            } else {
              console.error(`Unable to find an entity with uniqueId of ${uniqueId}`);
            }
          });
        } else {
          state.data = res;
        }
        response.next(state);
        response.complete();
      },
      error => {
        state = Object.assign({}, state, { loading: false, error: error });
        response.next(state);
        response.complete();
      },
    );
    return response;
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
