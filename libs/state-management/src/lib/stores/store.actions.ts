import { NtsState } from '../state.models';

/**
 * Typeguard for actions, checks action and ensures payload is properly typed
 * @example
 * if (isActionType(action, actionCreator)) {
 *      console.log(action.payload);
 * }
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
 * Easily create type safe action creators
 * @example
 * // Create an action creator
 * const guidChanged = actionCreator<string>('GUID_CHANGE');
 * // Create an action with a payload
 * const action = guidChanged('12345');
 * // Use built in typeguard to enforce type safety
 * if (guidChanged.match(action)) {
 *      console.log(action.payload); // '12345'
 * }
 * @returns
 */
export const actionCreator = <t>(type: string): NtsState.ActionCreator<t> => Object.assign(
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
)

/**
 * USAGE EXAMPLES
*/
// Create a new file that will be easily importable by the stores that need to consume it such as
// /shared/stores/store.actions.ts

// Import the actionCreator
// import { actionCreator } from '@ntersol/state-management';

/**
// Create and export an actions creator dictionary
export const actions = {
  // Initialize an action creator. An action needs a unique value and the type to associate with that
  tokenChanged: actionCreator<string>('TOKEN_CHANGED'),
  isLoggedIn: actionCreator<boolean>('IS_LOGGED_IN'),
  // activeUser: actionCreator<Models.User>('ACTIVE_USER'),
}

// OR create a standalone action creator. An action needs a unique enumerated value and the type to associate with that
export const tokenChangedAction = actionCreator<string>('TOKEN_CHANGED');

// Now create an action with a specific payload
// This will create an instance  of the token changed action with the associated string
const action = actions.tokenChanged('12345');


if (isActionType(action, actions.tokenChanged)) {
  console.log(action.payload); // '12345'
}

if (tokenChangedAction.match(action)) {
  console.log(action.payload); // '12345'
}
 */
