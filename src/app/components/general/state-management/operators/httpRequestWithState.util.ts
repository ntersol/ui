import { Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { NtsState } from '..';
/**
 * Intercept an http request and return a state object
 * @param source
 */
export const httpRequestWithState = () => <t>(source: Observable<t>) => {
  const state: NtsState.ApiState<t> = {
    loading: true,
    modifying: false,
    errorModify: null,
    error: null,
    data: null,
  };
  return source.pipe(
    map(x => <NtsState.ApiState<t>>Object.assign({}, state, { loading: false, error: null, data: x })),
    catchError(err => of(<NtsState.ApiState<t>>Object.assign({}, state, { loading: false, error: err }))),
    startWith(state),
  );
};
