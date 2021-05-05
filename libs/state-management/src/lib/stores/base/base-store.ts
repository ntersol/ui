import { Subject } from 'rxjs';
import { NtsState } from '../api/api-store.models';

export class NtsBaseStore {
  static _events$ = new Subject<NtsState.Event>();

  public dispatch(a: NtsState.Event) {
    NtsBaseStore._events$.next(a);
  }
}
