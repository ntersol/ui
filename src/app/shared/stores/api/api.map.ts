/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.actions.ts
2. Create a new entry in this api.map. Add endpoint, store property and uniqueID
3. Add the end data location in the main store state in api.store.service.ts
*/

// import IStore
import { AppStore } from '$shared';
import { ApiProps } from './api.props';
import { createEntityAdapter } from '@ngrx/entity';

// import { Models } from '$models';

/**
 * Returns an adapter for ngrx entity. This is necessary to define the unique ID/primary key for each model
 * @param uniqueId - The unique identifier for this model
 */
function createAdapter(uniqueId: string) {
  const adapter = createEntityAdapter({ selectId: (entity: any) => entity[uniqueId] });
  adapter.getInitialState({
    loading: false,
    data: null,
    error: false,
    modifying: false,
    success: false
  });
  return adapter;
}



export const ApiMap: AppStore.ApiMapping = {
  // Users Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiProps.users,
    uniqueId: 'id',
    adapter: createAdapter('id')
  },
};


