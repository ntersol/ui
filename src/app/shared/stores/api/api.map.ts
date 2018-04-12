/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.actions.ts
2. Create a new entry in this api.map. Add endpoint, store property and uniqueID
3. Add the end data location in the main store state in api.store.service.ts
*/

// import IStore
import { AppStore } from '$shared';
import { ApiActions } from './api.actions';

export const ApiMap: AppStore.ApiMapping = {
  // Users Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiActions.users,
    uniqueId: 'id'
  },

  /*
  # Deprecated in favor of memoized selectors located in each store selector file
  # This functionality is still available for edge use cases
  // If data needs to be transformed from the web API response before inserted into the store
  map: (users: Models.User[]) => {
    // Add some extra users to verify virtual scroll
    users = [...users, ...users, ...users, ...users, ...users, ...users, ...users, ...users, ...users, ...users, ];
    // Update instances and ID
    users = users.map((user, i) => {
      return {
        ...user,
      id: i
      };
    });
    // Sample dictionary mapping based on id property
    const dict: { [key: string]: Models.User } = {};
    users.forEach(user => (dict[user.id] = user));
    return {
      src: users,
      dict: dict,
    };
  },
  // If a different structure is inserted into the store, reference the unaltered source data here
  mapSrc: 'src',
  */
};
