import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { Models } from '$models';
import { AppStore } from '$shared';
import { ApiActions } from './api.actions';
import { Observable } from 'rxjs/Observable';

// Users
const usersSrc = (state: AppStore.Root) => state.api.users;
// Duplicate the number of users
const usersDuped = createSelector(usersSrc, users2 => {
  if (users2) {
    let users2New: Models.User[] = [];
    _.times(20, () => (users2New = [...users2New, ...users2]));
    return users2New.map((user, i) => Object.assign({}, user, { id: i, new: _.random(0, 10) > 3 ? true : false }));
  }
});
// Map users down to a dictionary based on ID
const usersMapped = createSelector(usersDuped, users2 => {
  if (users2) {
    return _.keyBy(users2, 'id');
  }
});

@Injectable()
export class ApiSelectorsService {
  public users$ = this.store.select(usersDuped);
  public usersMapped$ = this.store.select(usersMapped);

  /** Get the API data using api props */
  public getData$ = (apiProp: ApiActions) => this.store.select(store => store.api[apiProp]);
  /** Get the API state using api props */
  public getState$ = (apiProp: ApiActions) => this.store.select(store => store.apiStatus[apiProp]);

  constructor(private store: Store<AppStore.Root>) { }


  /**
   * Returns a single unified API status for one or more API status calls.
   * Useful for when the app needs multiple http calls and you only want a single status for all
   * USAGE: this.api.getStatuses([
      this.api.select.getState$(ApiActions.pod),
      this.api.select.getState$(ApiActions.productType),
    ])
   * @param statuses - A single observable or an array of observables
   */
  public getStatuses(statuses: Observable<AppStore.ApiStatus>[]) {
    // If this is an array, pass the array, if single load into array for combineLatest
    const statusesNew = Array.isArray(statuses) ? statuses : [statuses];

    return Observable.combineLatest(statusesNew).map(status => {
      if (status) {
        // Set default globals. Used to create final end state
        let loading = false;
        let loaded = false;
        let loadError = false;

        // Loop through all input statuses and rollup individual status to global status
        status.forEach(statusSingle => {
          if (statusSingle && statusSingle.loading) {
            loading = true;
          }
          if (statusSingle && statusSingle.loaded) {
            loaded = true;
          }
          if (statusSingle && statusSingle.loadError) {
            loadError = statusSingle.loadError;
          }

        });

        // Figure out which status state to return
        // If any errors, return an error state
        if (loadError) {
          return {
            loading: false,
            loaded: false,
            loadError: loadError
          };
        } else if (loading) {
          // If no errors but any endpoint is still loading, return loading
          return {
            loading: true,
            loaded: false,
            loadError: false
          };
        } else if (loaded && !loading && !loadError) {
          // If all endpoints return loaded and no errors of loading, return loaded
          return {
            loading: false,
            loaded: true,
            loadError: false
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  }
}
