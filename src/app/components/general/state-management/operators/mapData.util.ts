import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NtsState } from '../state';

/**
 * A map function that works directly on the data property preserving the api state wrapper
 * @param source
 */
export const mapData = <t>(fn: (data: t | null) => any) => (source: Observable<NtsState.ApiState<t>>): Observable<NtsState.ApiState<t>> => {
  return source.pipe(map(state => Object.assign({}, state, { data: fn(state.data) })));
};
