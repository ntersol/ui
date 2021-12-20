import { initialState, initialEntityState } from './initialState';
import { NtsState } from '../state.models';
const keysApi = Object.keys(initialState).sort();
const keysEntity = Object.keys(initialEntityState).sort();

/**
 * Typeguard for actions, checks action and ensures payload is properly typed
 * @param action
 * @param actionCreator
 * @returns
 */
export const isActionType = <t>(
  action: NtsState.Action,
  actionCreator: NtsState.ActionCreator,
): action is NtsState.Action<t> => {
  return action.type === actionCreator.type;
};

/**
 * Is this action an api action
 * @param action
 * @returns
 */
export const isActionApi = <t>(action: NtsState.Action<t> | NtsState.ApiAction<t>): action is NtsState.ApiAction<t> =>
  !!(action as NtsState.ApiAction<t>).storeId;

/**
 * Typeguard for checking if the input is an api state type
 * @param obj
 */
export const isApiState = (obj: any | null | undefined): obj is NtsState.ApiState => {
  // If null or not an object
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const entityKeys = Object.keys(obj).sort();

  const isMatch = true;
  for (let i = 0; i < keysApi.length; i++) {
    const key = keysApi[i];
    if (!entityKeys.includes(key)) {
      return false;
    }
  }

  return isMatch;
};

/**
 * Typeguard for checking if the input is an entity state type
 * @param obj
 */
export const isEntityState = (obj: any | null | undefined): obj is NtsState.ApiState => {
  // If null or not an object
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const entityKeys = Object.keys(obj).sort();

  const isMatch = true;
  for (let i = 0; i < keysEntity.length; i++) {
    const key = keysEntity[i];
    if (!entityKeys.includes(key)) {
      return false;
    }
  }

  return isMatch;
};
