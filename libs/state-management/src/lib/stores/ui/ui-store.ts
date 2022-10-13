import { BehaviorSubject, identity, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { NtsBaseStore } from '../base/base-store';
import { NtsState } from '../../state.models';
import { isBrowser } from '../../utils/guards.util';

/**
 * Create an instance of a UI store
 */
export class NtsUIStoreCreator<t> extends NtsBaseStore {
  /** Observable of store state */
  public state$ = new BehaviorSubject<t>({ ...this.initialState });

  constructor(private initialState: t, private options?: NtsState.UIStoreOptions) {
    super();
    // If persistID specified, rehydrate store state from localStorage
    if (isBrowser && this.options?.persistId) {
      const state = localStorage.getItem(this.options.persistId);
      if (state) {
        this.update(JSON.parse(state));
      }
    }
  }

  /**
   * Return data from the store
   * @param k
   * @param options
   * @returns
   **/
  public select$<Key extends keyof t>(key: Key, options?: NtsState.UIStoreOptions): Observable<t[Key]>;
  public select$<Payload>(k: (store: t) => Payload, options?: NtsState.UIStoreOptions): Observable<Payload>;
  public select$(k: NtsState.Select<t> | NtsState.Callback<t>, options?: NtsState.UIStoreOptions) {
    return this.state$.pipe(
      // Is this a function or string to pull out data from the model
      map((s) => (typeof k === 'function' ? k(s) : s[k])),
      // Disable distinctUntilChanged if requested in the options
      options?.disableDistinct ? identity : distinctUntilChanged(),
    );
  }

  /**
   * Update data in the store
   * @param update
   * @returns An observable with the entire store state object. Completes immediately.
   */
  public update(value: Partial<t>): Observable<t>;
  public update(value: (s: t) => Partial<t>): Observable<t>;
  public update(value: unknown): Observable<t> {
    if (typeof value === 'function') {
      this.state$.pipe(take(1)).subscribe((state) => {
        const n = value(state);
        this.stateChange(n);
      });
    } else {
      this.stateChange(value as t);
    }
    // If persistId is specified, save all state changes to localStorage
    if (isBrowser && this.options?.persistId) {
      this.state$
        .pipe(take(1))
        .subscribe((state) => localStorage.setItem(this.options?.persistId || '', JSON.stringify(state)));
    }

    return this.state$.pipe(take(1));
  }

  /**
   * Reset store to it's initial state
   */
  public reset() {
    this.stateChange({ ...this.initialState });
  }

  /**
   * Update state of UI store
   * @param update
   */
  private stateChange(update: Partial<t>) {
    this.state$.pipe(take(1)).subscribe((state) => this.state$.next({ ...state, ...update }));
  }
}

/**
 * Create an instance of a UI store
 */
export const ntsUIStoreCreator = <t>(initialState: t, options?: NtsState.UIStoreOptions) =>
  new NtsUIStoreCreator<t>(initialState, options);
