import { NtsWizard } from '../..';

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
  action: NtsWizard.StateAction<unknown>,
  actionCreator: NtsWizard.ActionCreator,
): action is NtsWizard.StateAction<t> => {
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
export const actionCreator = <t>(type: string): NtsWizard.ActionCreator<t> =>
  Object.assign(
    (payload: t, meta?: any) => {
      const action: NtsWizard.StateAction<t> = {
        type: type,
        payload: payload,
        meta: meta,
      };
      return action;
    },
    {
      type: type,
      match: (action: NtsWizard.StateAction): action is NtsWizard.StateAction<t> => action.type === type,
    },
  );
