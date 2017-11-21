import { IStore, ApiStatusStore, ApiActions } from 'app-shared';


export function ApiStatusReducer(state = ApiStatusStore, { type, payload }) {
	//console.log('STORE REDUCER: ApiStatusReducer', type, payload);


	switch (type) {

		// Reset State
		case ApiActions.RESET:
			return ApiStatusStore;

		// State change
		case ApiActions.STATE_CHANGE:
			state[payload.apiMap.storeProperty] = Object.assign({}, state[payload.apiMap.storeProperty], payload.newState);
			break;

		// Reset API errors
		case ApiActions.RESET_ERRORS:
			Object.keys(state).forEach(key => {
				state[key].modifyError = false;
				state[key] = Object.assign({}, state[key]);
			});
			break;

		// Reset API errors
		case ApiActions.RESET_SUCCESS:
			Object.keys(state).forEach(key => {
				state[key].modified = false;
				state[key] = Object.assign({}, state[key]);
			});
			break;
	}
	
	return state;
}
