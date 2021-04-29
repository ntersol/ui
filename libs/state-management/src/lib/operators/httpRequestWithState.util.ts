import { Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { NtsState } from '../state.models';

/**
 * Intercept an http request and return a state object
 * @param source
 */
export const httpRequestWithState = () => <t>(source: Observable<t>) => {
  const state: NtsState.ApiState = {
    loading: true,
    modifying: false,
    errorModify: null,
    error: null,
    data: false,
  };
  return source.pipe(
    map((x) => <NtsState.ApiState>Object.assign({}, state, { loading: false, error: null, data: x })),
    catchError((err) => of(<NtsState.ApiState>Object.assign({}, state, { loading: false, error: err }))),
    startWith(state),
  );
};
