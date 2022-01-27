import { Subject } from 'rxjs';
import { NtsState2 } from './state2.models';

const _events$ = new Subject<NtsState2.Action | NtsState2.ApiAction>();

export const ntsBaseStore = () => {
  const store: NtsState2.BaseStore = {
    events$: _events$.asObservable(),
    /**
     *
     * @param a
     */
    dispatch: (a: NtsState2.Action | NtsState2.ApiAction) => {
      _events$.next(a);
    },
  };
  return store;
};
