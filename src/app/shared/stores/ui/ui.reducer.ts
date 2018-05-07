import { isType } from 'typescript-fsa';
import { AppStore } from '$shared';
import { UIStoreActions } from './ui.actions';

import { Action } from 'typescript-fsa';

// Define initial store state : State.main
const initialState: AppStore.Ui = {
  saveState: null,
  modal: null,
  multiScreen: false,
  tabsActive: {},
};

export function UIStoreReducer(state = initialState, action: Action<any>) {
  // console.log('UI REDUCER:', action);

  if (isType(action, UIStoreActions.REHYDRATE)) {
    state = { ...initialState, ...action.payload }; 
  }

  if (isType(action, UIStoreActions.MODAL_OPEN)) {
    state.modal = { ...action.payload };
  }

  if (isType(action, UIStoreActions.MODAL_UNLOAD)) {
    state.modal = null;
  }

  if (isType(action, UIStoreActions.TAB_CHANGE)) {
    state.tabsActive[action.payload.tabInstanceId] = action.payload.tabId;
  }

  if (isType(action, UIStoreActions.MULTISCREEN_TOGGLE)) {
    state.multiScreen = action.payload !== null ? action.payload : !state.multiScreen;
  }

  // If the namespace is the UI store
  // Do not save state on rehydrate
  if (action.type && action.type.split('/')[0] === 'ui' && action.type !== UIStoreActions.REHYDRATE.type) {
    const saveState = { ...state };
    delete saveState.saveState;
    state.saveState = JSON.parse(JSON.stringify(saveState));
  }

  // console.log('UI STATE: ', JSON.parse(JSON.stringify(state)));
  return state;
}
