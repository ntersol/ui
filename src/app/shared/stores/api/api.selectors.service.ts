import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';

import { Models } from '$models';
import { AppStore } from '$shared';
import { ApiActions } from './api.actions';

// Users
const usersSrc = (state: AppStore.Root) => state.api.users;
// Duplicate the number of users
const usersDuped = createSelector(
  usersSrc,
  (users2) => {
    if (users2) {
      return [...users2, ...users2, ...users2, ...users2, ...users2, ...users2, ...users2, ...users2]
        .map((user, i) => {
        return {
          ...user,
          id: i
        };
      });
    }
  });
// Map users down to a dictionary based on ID
const usersMapped = createSelector(
  usersSrc,
  (users2) => {
    if (users2) {
      const dict: { [key: string]: Models.User } = {};
      users2.forEach(user => (dict[user.id] = user));
      return dict;
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


  constructor(
    private store: Store<AppStore.Root>,
  ) { }

}
