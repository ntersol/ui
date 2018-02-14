import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null
};

export function UIStoreReducer(state = initialState, { type, payload }) {
  // console.log('UI REDUCER:', type, payload);

  // Write state to localstorage for persistence
  const saveState = () => {
    window.localStorage.setItem('ui', JSON.stringify(state));
  };

  switch (type) {

    case UIStoreActions.REHYDRATE:
      state = { ...payload };
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
