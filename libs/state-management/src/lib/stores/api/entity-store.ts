import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsState } from '../../state.models';
import { NtsApiStoreCreator } from './api-store-creator';

const configSrc: NtsState.ConfigEntity = {
  uniqueId: 'guid',
};

/**
 * Create an instance of an entity store
 */
export class NtsEntityStore<t> extends NtsApiStoreCreator<t[]> {
  public override state$!: Observable<NtsState.EntityApiState<t>>;

  /** Modify the store data with the supplied callback function while preserving state information.
   *
   * Useful for mapping or filtering data in the store while still maintaining access to state.  */
  public stateSelect$ = (fn: NtsState.SelectEntities<t>) =>
    this.state$.pipe(
      map((state) => {
        const data = !!state.data ? fn([...state.data]) : state.data;
        const entities = !!data
          ? <Record<string, t>>data.reduce((a: any, b: any) => ({ ...a, [b[String(this.config.uniqueId)]]: b }), {})
          : {};
        return Object.assign({}, state, { data: data, entities: entities }) as NtsState.EntityApiState<t>;
      }),
    );

  /** Select an array of all the entities in the store. Does not include state. */
  public selectAll$ = this.state$.pipe(
    map((s) => s.data),
    distinctUntilChanged(),
  );

  /** Select a single entity from the store. Does not include state. */
  public selectOne$ = (uniqueId: string | number) =>
    this.state$.pipe(
      map((s) => (!!s.entities && !!s.entities[uniqueId] ? (s.entities[uniqueId] as t) : null)),
      distinctUntilChanged(),
    );

  /**
   * Select a or modify subset of data from the store. Does not include state.
   * Pass a callback function that modifies the data in the store property
   */
  public select$ = (fn: NtsState.SelectEntities<t>) =>
    this.state$.pipe(
      map((s) => fn(!!s.data ? [...s.data] : s.data)),
      distinctUntilChanged(),
    );

  constructor(http: HttpClient, protected override config: NtsState.ConfigEntity) {
    super(http, Object.assign(configSrc, config), true);
  }
}
