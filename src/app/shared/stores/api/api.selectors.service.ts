import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';

import { Models } from '$models';
import { AppStore } from '$shared';
import { ApiProps } from './api.props';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const times = require('lodash/times');
const keyBy = require('lodash/keyBy');
const random = require('lodash/random');

// Mapped/source selectors for reuse or transforming data
const selectors = {
  usersDuped: createSelector(
    (state: AppStore.Root) => state.api.users,
    users => {
      if (users) {
        let usersNew: Models.User[] = [];
        times(20, () => (usersNew = [...usersNew, ...users]));
        return usersNew.map((user, i) => Object.assign({}, user, { id: i, new: random(0, 10) > 3 ? true : false }));
      }
    },
  ),
  usersMapped: createSelector(
    (state: AppStore.Root) => state.api.users,
    users => {
      if (users) {
        return keyBy(users, 'id');
      }
    },
  ),
};

@Injectable({
  providedIn: 'root',
})
export class ApiSelectorsService {
  public users$ = this.store.select(selectors.usersDuped);
  public usersMapped$ = this.store.select(selectors.usersMapped);

  /** Get the API data using api props */
  public getData$ = (apiProp: ApiProps) => this.store.select(store => store.api[apiProp]);
  /** Get the API state using api props */
  public getState$ = (apiProp: ApiProps) => this.store.select(store => store.apiStatus[apiProp]);

  constructor(private store: Store<AppStore.Root>) {}

  /**
   * Returns a single unified API status for one or more API status calls.
   * Useful for when the app needs multiple http calls and you only want a single status for all
   * USAGE: this.api.getStatuses([
      this.api.select.getState$(ApiProps.pod),
      this.api.select.getState$(ApiProps.productType),
    ])
   * @param statuses - A single observable or an array of observables
   */
  public getStatuses(statuses: Observable<AppStore.ApiStatus>[]) {
    // If this is an array, pass the array, if single load into array for combineLatest
    const statusesNew = Array.isArray(statuses) ? statuses : [statuses];

    return combineLatest(statusesNew).pipe(
      map(status => {
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
              loadError: loadError,
            };
          } else if (loading) {
            // If no errors but any endpoint is still loading, return loading
            return {
              loading: true,
              loaded: false,
              loadError: false,
            };
          } else if (loaded && !loading && !loadError) {
            // If all endpoints return loaded and no errors of loading, return loaded
            return {
              loading: false,
              loaded: true,
              loadError: false,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
    );
  }
}
