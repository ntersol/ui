import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NtsState } from '../state.models';

/**
 * A map function that works directly on the data property preserving the api state wrapper
 * @param source
 */
export const mapData = <t>(fn: (data?: t | null) => any) => (
  source: Observable<NtsState.EntityState<t>>,
): Observable<NtsState.EntityState<t>> => {
  return source.pipe(map((state) => Object.assign({}, state, { data: fn(state.data as any) })));
};
