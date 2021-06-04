import { NtsState } from '../state.models';

/**
 * Typeguard for actions, checks action and ensures payload is properly typed
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

/** */
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

const actionCreator = actionCreatorFactory();
const guidChanged = actionCreator<string>('GUID_CHANGE');
const action = guidChanged('12345');

if (isActionType(action, guidChanged)) {
  const temp = action.payload;
}

if (guidChanged.match(action)) {
  const temp = action.payload;
}
