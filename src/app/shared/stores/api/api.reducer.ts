import { ApiStoreActions } from './api.actions';
import { ApiUtils } from '$utils';
import { AppStore } from '../store';

import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

export function ApiReducer(state: { [key: string]: AppStore.ApiState<any> } = {}, action: Action) {
  console.log('ApiReducer', action, ApiStoreActions);

  //let srcData: any;
   /**
   * /
  if (action.payload && action.payload.apiMap && state[action.payload.apiMap.storeProperty]) {
    srcData = state[action.payload.apiMap.storeProperty].data;
  }
 
 
   
  // If an entry does not exist in the store, create it dynamically
  if (action.payload && action.payload.apiMap && !state[action.payload.apiMap.storeProperty]) {
    state[action.payload.apiMap.storeProperty] = {};
  }
  */


  if (isType(action, ApiStoreActions.STATE_LOADING)) {
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], loading: true, error: false
    };
  }

  if (isType(action, ApiStoreActions.STATE_MODIFYING)) {
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], modifying: true, error: false, success: false
    };
  }

  if (isType(action, ApiStoreActions.STATE_ERROR)) {
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], modifying: false, loading: false, error: action.payload.data
    };
  }

  // Get complete
  if (isType(action, ApiStoreActions.GET_COMPLETE)) {
    // If an entry does not exist in the store, create it dynamically
    if (action.payload && action.payload.apiMap && !state[action.payload.apiMap.storeProperty]) {
      state[action.payload.apiMap.storeProperty] = {};
    }
    // If response is an array
    if (Array.isArray(action.payload.data)) {
      state[action.payload.apiMap.storeProperty].data = [...action.payload.data];
    } else if (typeof action.payload.data === 'object') {
      // If response is an object
      state[action.payload.apiMap.storeProperty].data = { ...action.payload.data };
    } else {
      // All other types are primitives and can be put straight into the store
      state[action.payload.apiMap.storeProperty].data = action.payload.data;
    }
    // Update State
    state[action.payload.apiMap.storeProperty] = { ...state[action.payload.apiMap.storeProperty], loading: false, error: false };
  }

  // Post complete
  if (isType(action, ApiStoreActions.POST_COMPLETE)) {
    let srcData = state[action.payload.apiMap.storeProperty].data;
    // If destination is an array and response is an array, concat with new data up front
    if (Array.isArray(srcData) && Array.isArray(action.payload.data)) {
      srcData = [...action.payload.data, ...srcData];
    } else if (srcData && typeof action.payload.data === 'object') {
      // If destination is an array and response is an object, push with new data up front
      srcData = [action.payload.data, ...srcData];
    } else if (typeof srcData === 'object' && typeof action.payload.data === 'object') {
      // If destination is an object and response is an object, replace current instance
      srcData = { ...action.payload.data };
    }

    // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
    state[action.payload.apiMap.storeProperty].data = srcData;

    // Update State
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
    };
  }

  // Put complete operation
  if (isType(action, ApiStoreActions.PUT_COMPLETE)) {
    let srcData = state[action.payload.apiMap.storeProperty].data;
    // Perform REPLACE
    state[action.payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, action.payload.data, action.payload.apiMap.uniqueId, 'replace');
    // Update State
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
    };
  }

  // Upsert
  if (isType(action, ApiStoreActions.UPSERT_COMPLETE)) {
    let srcData = state[action.payload.apiMap.storeProperty].data;
    // Perform UPSERT
    state[action.payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, action.payload.data, action.payload.apiMap.uniqueId, 'upsert');
    // Update State
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
    };
  }

  // Upsert
  if (isType(action, ApiStoreActions.DELETE_COMPLETE)) {
    let srcData = state[action.payload.apiMap.storeProperty].data;
    // Perform DELETE
    state[action.payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, action.payload.data, action.payload.apiMap.uniqueId, 'delete');

    // Update State
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
    };
  }

  /*
  switch (type) {
    // Reset State
    case ApiStatusActions.RESET:
      return {};

    // State Change: Loading
    case ApiStoreActions.STATE_LOADING:
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], loading: true, error: false
      };
      break;

    // State Change: Modifying via put/post/delete
    case ApiStatusActions.STATE_MODIFYING:
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], modifying: true, error: false, success: false
      };
      break;

    // State Change: Error
    case ApiStatusActions.STATE_ERROR:
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], modifying: false, loading: false, error: payload.data
      };
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
     
      // Perform UPSERT
      state[payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'upsert');

      // Update State
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
      };
      break;

    // POST
    case ApiStatusActions.POST_COMPLETE:
      
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
      state[payload.apiMap.storeProperty].data = srcData;

      // Update State
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
      };
      break;

    // PUT
    case ApiStatusActions.PUT_COMPLETE:
      
      // Perform REPLACE
      state[payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'replace');

      // Update State
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
      };
      break;

    // DELETE
    case ApiStatusActions.DELETE_COMPLETE:
     
      // Perform DELETE
      state[payload.apiMap.storeProperty].data = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'delete');

      // Update State
      state[payload.apiMap.storeProperty] = {
        ...state[payload.apiMap.storeProperty], loading: false, error: false, modifying: false, success: true
      };
      break;
  }
  */

  return state;
}
