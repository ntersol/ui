import { Subject } from 'rxjs';
import { NtsState } from '../api/api-store.models';

export class NtsBaseStore {
  static _events$ = new Subject<NtsState.Action>();

  public events$ = NtsBaseStore._events$.pipe();

  public dispatch(a: NtsState.Action) {
    NtsBaseStore._events$.next(a);
  }
}

const ntsBaseStoreSrc = new NtsBaseStore();

/**
 * Returns the base store instance shared by all stores
 * @returns
 */
export const ntsBaseStore = () => {
  return ntsBaseStoreSrc;
};
