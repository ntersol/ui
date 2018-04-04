import { AppStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

// Define initial store state : State.main
const initialState: AppStore.Ui = {
  modal: null,
  multiScreen: false
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
    case UIStoreActions.MULTISCREEN_TOGGLE:
      state.multiScreen = payload !== null ? payload : !state.multiScreen;
      uiHasChange = true;
      break;
  }

  if (uiHasChange) {
    state = { ...state };
  }

  // console.log('UI STATE: ', state);
  return state;
}
