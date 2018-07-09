import { ApiStatusActions } from './api.actions';
import { ApiUtils } from '$utils';
import { AppStore } from '../store';

export function ApiReducer(state: { [key: string]: AppStore.ApiState<any> } = {}, { type, payload }: any) {
  // console.log(type, payload);

  let srcData: any;

  // If an entry does not exist in the store, create it dynamically
  if (payload && payload.apiMap && !state[payload.apiMap.storeProperty]) {
    state[payload.apiMap.storeProperty] = {};
  }

  switch (type) {
    // Reset State
    case ApiStatusActions.RESET:
      return {};

    // State Change: Loading
    case ApiStatusActions.STATE_LOADING:
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: true, error: false };
      break;

    // State Change: Modifying via put/post/delete
    case ApiStatusActions.STATE_MODIFYING:
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], modifying: true, error: false };
      break;

    // State Change: Error
    case ApiStatusActions.STATE_ERROR:
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], modifying: false, loading: false, error: payload.data };
      break;

    // GET
    case ApiStatusActions.GET_COMPLETE:
      // If response is an array
      if (Array.isArray(payload.data)) {
        state[payload.apiMap.storeProperty].data = [...payload.data];
      } else if (typeof payload.data === 'object') {
        // If response is an object
        state[payload.apiMap.storeProperty].data = { ...payload.data };
      } else {
        // All other types are primitives and can be put straight into the store
        state[payload.apiMap.storeProperty].data = payload.data;
      }
      // Update State
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: false, error: false };
      break;

    // UPSERT
    case ApiStatusActions.UPSERT_COMPLETE:
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      //      Otherwise just get data straight out of the store
      srcData =
        payload.apiMap.map && payload.apiMap.mapSrc
          ? state[payload.apiMap.storeProperty].data[payload.apiMap.mapSrc]
          : state[payload.apiMap.storeProperty].data;

      // Perform UPSERT
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'upsert');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty].data =
        payload.apiMap.map && payload.apiMap.mapSrc ? payload.apiMap.map(srcData) : srcData;

      // Update State
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false };
      break;

    // POST
    case ApiStatusActions.POST_COMPLETE:
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      //  Otherwise just get data straight out of the store
      srcData =
        payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty].data[payload.apiMap.mapSrc]
          : state[payload.apiMap.storeProperty].data;

      // If destination is an array and response is an array, concat with new data up front
      if (Array.isArray(srcData) && Array.isArray(payload.data)) {
        srcData = [...payload.data, ...srcData];
      } else if (srcData && typeof payload.data === 'object') {
        // If destination is an array and response is an object, push with new data up front
        srcData = [payload.data, ...srcData];
      } else if (typeof srcData === 'object' && typeof payload.data === 'object') {
        // If destination is an object and response is an object, replace current instance
        srcData = { ...payload.data };
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty].data =
        payload.apiMap.map && payload.apiMap.mapSrc ? payload.apiMap.map(srcData) : srcData;

      // Update State
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false };
      break;

    // PUT
    case ApiStatusActions.PUT_COMPLETE:
      // console.warn('PUT_COMPLETE', payload)
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData =
        payload.apiMap.map && payload.apiMap.mapSrc
          ? state[payload.apiMap.storeProperty].data[payload.apiMap.mapSrc]
          : state[payload.apiMap.storeProperty].data;

      // Perform REPLACE
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'replace');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty].data =
        payload.apiMap.map && payload.apiMap.mapSrc ? payload.apiMap.map(srcData) : srcData;

      // Update State
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false };
      break;

    // DELETE
    case ApiStatusActions.DELETE_COMPLETE:
      // console.warn('Delete Reducer ', payload)
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData =
        payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty].data[payload.apiMap.mapSrc]
          : state[payload.apiMap.storeProperty].data;

      // Perform DELETE
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'delete');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] =
        payload.apiMap.map && payload.apiMap.mapSrc ? payload.apiMap.map(srcData) : srcData;

      // Update State
      state[payload.apiMap.storeProperty] = { ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false };
      break;
  }

  return state;
}
