import { IStore, StoreActionsUi } from '@shared';


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
			state = Object.assign({}, payload);
			saveState();
			break;
     
		case StoreActionsUi.MODAL_OPEN:
			state.modal = Object.assign({}, payload);
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
