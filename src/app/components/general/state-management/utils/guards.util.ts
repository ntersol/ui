import { initialState } from './initialState';
const keys = Object.keys(initialState).sort();
/**
 * Typeguard for checking if the input is an entity state type
 * @param obj
 */
export const isEntityState = (obj: any | null | undefined): obj is NtsState.EntityState => {
  // If null or not an object
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const entityKeys = Object.keys(obj).sort();

  const isMatch = true;
  for (let i = 0; i < entityKeys.length; i++) {
    const key = entityKeys[i];
    if (key !== keys[i]) {
      return false;
    }
  }

  return isMatch;
};
