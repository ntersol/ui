import { NtsState } from '../state.models';

export const initialState: NtsState.ApiState = {
  loading: false,
  modifying: false,
  error: null,
  errorModify: null,
  data: false,
};

export const initialEntityState: NtsState.EntityState = {
  ...initialState,
  entities: {},
  ids: [],
  data: null,
};
