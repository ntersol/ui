import { AppStore } from '$shared';
import { UIStoreActions } from './ui.actions';

// Define initial store state : State.main
const initialState: AppStore.Ui = {
  saveState: null,
  modal: null,
  multiScreen: false,
};

export function UIStoreReducer(state = initialState, { type, payload }: any) {
   // console.log('UI REDUCER:', type, payload);

  // Determines if the UI state needs to be saved
  let needSave = false;

  switch (type) {
    case UIStoreActions.REHYDRATE:
      state = { ...initialState, ...payload };
      break;
    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      needSave = true;
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      needSave = true;
      break;
    case UIStoreActions.MULTISCREEN_TOGGLE:
      state.multiScreen = payload !== null ? payload : !state.multiScreen;
      needSave = true;
      break;
  }

  // If needSave is set, update property, load a static snapshot of the ui store into this property
  if (needSave) {
    const saveState = { ...state };
    delete saveState.saveState;
    state.saveState = JSON.parse(JSON.stringify(saveState));
  }
  // console.log('UI STATE: ', JSON.parse(JSON.stringify(state)));
  return state;
}
