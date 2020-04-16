import { initialState, initialEntityState } from './initialState';
import { NtsState } from '..';
const keysApi = Object.keys(initialState).sort();
const keysEntity = Object.keys(initialEntityState).sort();
/**
 * Typeguard for checking if the input is an api state type
 * @param obj
 */
export const isApiState = (obj: any | null | undefined): obj is NtsState.EntityState => {
  // If null or not an object
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const entityKeys = Object.keys(obj).sort();  const isMatch = true;
  for (let i = 0; i < keysApi.length; i++) {
    const key = keysApi[i];
    if (!entityKeys.includes(key)) {
      return false;
    }
  }  return isMatch;
};/**
 * Typeguard for checking if the input is an entity state type
 * @param obj
 */
export const isEntityState = (obj: any | null | undefined): obj is NtsState.EntityState => {
  // If null or not an object
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const entityKeys = Object.keys(obj).sort();  const isMatch = true;
  for (let i = 0; i < keysEntity.length; i++) {
    const key = keysEntity[i];
    if (!entityKeys.includes(key)) {
      return false;
    }
  }  return isMatch;
};