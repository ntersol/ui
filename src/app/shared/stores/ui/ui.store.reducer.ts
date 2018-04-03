import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null,
};

export function UIStoreReducer(state = initialState, { type, payload }: any) {
  // console.log('UI REDUCER:', type, payload);
  let uiHasChange = false;

  switch (type) {
    case UIStoreActions.REHYDRATE:
      state = { ...payload };
      uiHasChange = true;
      break;

    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      uiHasChange = true;
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      uiHasChange = true;
      break;
  }

  if (uiHasChange) {
    state = { ...state };
  }

  // console.log('UI STATE: ', state);
  return state;
}
