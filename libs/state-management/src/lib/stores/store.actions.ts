import { NtsState } from '../state.models';

/**
 * Typeguard for actions, checks action and ensures payload is properly typed
 * @example
 * if (isActionType(action, actionCreator)) {
        console.log(action.payload); // '12345'
   }

 * @param action
 * @param actionCreator
 * @returns
 */
export const isActionType = <t>(
  action: NtsState.Action<unknown>,
  actionCreator: NtsState.ActionCreator,
): action is NtsState.Action<t> => {
  return action.type === actionCreator.type;
};

/**
 * Returns an action creator factory
 * @example
 * // Create the factory
 * const actionCreator = actionCreatorFactory();
 * // Create an action
 * const guidChanged = actionCreator<string>('GUID_CHANGE');
 * // Create a specific instance of that action with a payload
 * const action = guidChanged('12345');
 * // Use built in typeguard to enforce type safety
 * if (guidChanged.match(action)) {
 *      console.log(action.payload); // '12345'
 * }
 * @returns
 */
export const actionCreatorFactory = () => <t>(type: string): NtsState.ActionCreator<t> => {
  return Object.assign(
    (payload: t) => {
      const action: NtsState.Action<t> = {
        type: type,
        payload: payload,
      };
      return action;
    },
    {
      type: type,
      match: (action: NtsState.Action): action is NtsState.Action<t> => action.type === type,
    },
  );
};

/**
 * USAGE EXAMPLES
const actionCreator = actionCreatorFactory();
const guidChanged = actionCreator<string>('GUID_CHANGE');
const action = guidChanged('12345');

if (isActionType(action, guidChanged)) {
  console.log(action.payload); // '12345'
}

if (guidChanged.match(action)) {
  console.log(action.payload); // '12345'
}
*/
