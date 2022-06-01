import { NtsState } from '../state.models';
import { isApiState } from './guards.util';

/**
 * Combines the domain state from multiple entity stores into a single state object.
 * Useful when joining the data from multiple stores into a single stream
 * If multiple errors, will only keep the first error in sequence
 * @param states
 * @param data
 */
export const NtsCombineEntityState = (
  states:
    | NtsState.ApiState
    | NtsState.EntityApiState
    | (NtsState.ApiState | NtsState.EntityApiState | null | undefined)[]
    | undefined
    | null,
): NtsState.ApiState => {
  const state: NtsState.ApiState = {
    loading: false,
    modifying: false,
    error: null,
    errorModify: null,
    data: false,
  };

  // If state is nil
  if (!states) {
    return state;
  }
  // Ensure states is always an array for reduce
  const statesArray = !Array.isArray(states) ? [states] : states;
  // Filter out any non-entity states in array
  const statesEntity = statesArray.filter(isApiState);

  // Roll up the separate entity states into a single state object
  if (statesEntity && statesEntity.length) {
    state.loading = statesEntity.reduce((a, b) => a || b.loading, <boolean>false);
    state.modifying = statesEntity.reduce((a, b) => a || b.modifying, <boolean>false);
    state.error = statesEntity.reduce((a, b) => a || b.error, <any>null);
    state.errorModify = statesEntity.reduce((a, b) => a || b.errorModify, <any>null);
    state.data = statesEntity.reduce(
      (a, b) => (b.data === undefined || b.data === null || a === false ? false : a),
      <boolean>true,
    );
  }
  return state;
};
