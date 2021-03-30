import { NtsState } from '../state';

export const initialState: NtsState.ApiState = {
  loading: false,
  modifying: false,
  error: null,
  errorModify: null,
  data: null,
};

export const initialEntityState: NtsState.EntityState = {
  ...initialState,
  entities: {},
  ids: [],
  data: null,
};
