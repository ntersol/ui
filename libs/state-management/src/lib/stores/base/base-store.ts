import { Subject } from 'rxjs';
import { NtsState } from '../../state.models';

export class NtsBaseStore {
  static _events$ = new Subject<NtsState.Action | NtsState.ApiAction>();

  public events$ = NtsBaseStore._events$.pipe();

  public dispatch(a: NtsState.Action | NtsState.ApiAction) {
    NtsBaseStore._events$.next(a);
  }
}

/**
 * Base store instance shared by all stores
 * @returns
 */
export const ntsStore = new NtsBaseStore();
