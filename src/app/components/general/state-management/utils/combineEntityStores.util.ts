import { isApiState, isEntityState } from './guards.util';
import { NtsState } from '../state';
import { ntsCombineEntityState } from './combineEntityState.util';

/**
 * Combines the domain state from multiple entity stores into a single state object.
 * Useful when joining the data from multiple stores into a single stream
 * If multiple errors, will only keep the first error in sequence
 * @param states
 * @param waitForData - Keep data property null until all inputs have non-nill data
 */
export const ntsCombineEntityStores = <t>(
  states: (NtsState.EntityState<t> | t | null | undefined)[],
  waitForData = true,
): NtsState.ApiState<t[] | undefined> => {
  const state = ntsCombineEntityState(states);

  // If state is nil
  if (!state) {
    return state;
  }
  // Ensure states is always an array for reduce
  const statesArray = !Array.isArray(states) ? [states] : states;

  // Extract data, default to undefined
  const dataArray = statesArray.map(s => (isApiState(s) ? s.data : s));
  // Do all inputs have data and are not undefined
  const hasData: boolean = statesArray.reduce(
    (a, b) => ((isEntityState(b) && b.data === undefined) || (b || a) === (undefined) ? false : true),
    true,
  ) as any;

  let data: any;
  if (waitForData && hasData) {
    data = dataArray;
  } else if (!waitForData) {
    data = dataArray;
  }

  return { ...state, data: data };
};
