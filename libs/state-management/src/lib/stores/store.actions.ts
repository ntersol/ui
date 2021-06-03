import { NtsState } from '../state.models';

/** */
export const isType = <t>(
  action: NtsState.Action,
  actionCreator: NtsState.ActionCreator,
): action is NtsState.Action<t> => {
  return action.type === actionCreator.type;
};

/**
export const actionCreatorFactory = (prefix?: string | null) => <t>(type: string) => {
    const base = prefix ? `${prefix}/` : '';
    const action: NtsState.Action = {

    }
};
 */
