import { IStore } from 'src/app/shared/stores/store';
import { StoreActionsUi } from 'src/app/shared/stores/ui/ui.actions';


//Define initial store state : State.main
const initialState: IStore.ui = {
    modal: null
};

export function StoreUIReducer(state = initialState, { type, payload }) {
	//console.log('UI REDUCER:', type, payload);

    // Write state to localstorage for persistence
	let saveState = () => {
		window.localStorage.setItem('ui', JSON.stringify(state));
	}

	switch (type) {

		case StoreActionsUi.REHYDRATE:
			state = { ...payload }
			saveState();
			break;
     
		case StoreActionsUi.MODAL_OPEN:
			state.modal = { ...payload }
			saveState();
			break;
		case StoreActionsUi.MODAL_UNLOAD:
			state.modal = null;
			saveState();
			break;
	
	}
	
	//console.log('UI STATE: ', state);
	return state;
}
