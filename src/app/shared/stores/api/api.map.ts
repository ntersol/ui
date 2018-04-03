/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.properties.ts
2. Create a new entry in api.map. Add endpoint, store property and uniqueID
3. Add the end data location in the main store state in api.state.ts
*/

// import IStore
import { AppStore } from '@shared';
import { ApiActions } from './api.actions';
import { User } from '@models';
// IStore.ApiMap

export const ApiMap: AppStore.ApiMapping = {
  // Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiActions.users,
    uniqueId: 'id',
    mapSrc: 'src',
    map: (users: User[]) => {
      // Sample dictionary mapping based on id property
      const dict: { [key: string]: any } = {};
      users.forEach(user => (dict[user.id] = user));
      return {
        src: users,
        dict: dict,
      };
    },
  },
};
