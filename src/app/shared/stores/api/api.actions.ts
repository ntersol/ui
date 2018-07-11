import actionCreatorFactory from 'typescript-fsa';
import { AppStore } from '$shared';

const actionCreator = actionCreatorFactory('api');

export const ApiStoreActions = {
  RESET: actionCreator<null>('RESET'),
  RESET_ERRORS: actionCreator<null>('RESET_ERRORS'),
  RESET_SUCCESS: actionCreator<null>('RESET_SUCCESS'),

  STATE_LOADING: actionCreator<AppStore.ApiResponse>('STATE_LOADING'),
  STATE_MODIFYING: actionCreator<AppStore.ApiResponse>('STATE_MODIFYING'),
  STATE_ERROR: actionCreator<AppStore.ApiResponse>('STATE_ERROR'),

  GET_COMPLETE: actionCreator<AppStore.ApiResponse>('GET_COMPLETE'),
  POST_COMPLETE: actionCreator<AppStore.ApiResponse>('POST_COMPLETE'),
  PUT_COMPLETE: actionCreator<AppStore.ApiResponse>('PUT_COMPLETE'),
  UPSERT_COMPLETE: actionCreator<AppStore.ApiResponse>('UPSERT_COMPLETE'),
  DELETE_COMPLETE: actionCreator<AppStore.ApiResponse>('DELETE_COMPLETE'),
};









export enum ApiStatusActions {
  RESET = 'RESET',

  STATE_CHANGE = 'STATE_CHANGE',

  STATE_LOADING = 'STATE_LOADING',
  STATE_MODIFYING = 'STATE_MODIFYING',
  STATE_ERROR = 'STATE_ERROR',

  RESET_ERRORS = 'RESET_ERRORS',
  RESET_SUCCESS = 'RESET_SUCCESS',

  GET_COMPLETE = 'GET_COMPLETE',
  POST_COMPLETE = 'POST_COMPLETE',
  PUT_COMPLETE = 'PUT_COMPLETE',
  UPSERT_COMPLETE = 'UPSERT_COMPLETE',
  DELETE_COMPLETE = 'DELETE_COMPLETE',
}
