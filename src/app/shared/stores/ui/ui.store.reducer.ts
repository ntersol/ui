import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

/** Which properties of the store properties to NOT persist or save to local storage */
const ignoreProps = ['loanHasUpdate', 'forms'];

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null
};

export function UIStoreReducer(state = initialState, { type, payload }) {
  // console.log('UI REDUCER:', type, payload);

  // Write state to localstorage for persistence
  const saveState = () => {
    let stateNew = { ...state };
    // Delete any keys that should not be persisted
    for (let key in stateNew) {
      if (stateNew.hasOwnProperty(key) && ignoreProps.indexOf(key) != -1 && stateNew[key]) {
        delete stateNew[key];
      }
    }
    // Save UI state to localstorage
    window.localStorage.setItem('ui', JSON.stringify(stateNew));
  };

  switch (type) {

    case UIStoreActions.REHYDRATE:
      state = { ...initialState, ...payload };
      saveState();
      break;

    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      saveState();
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      saveState();
      break;

  }

  // console.log('UI STATE: ', state);
  return state;
}
