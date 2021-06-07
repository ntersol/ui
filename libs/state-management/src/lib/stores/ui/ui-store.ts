import { BehaviorSubject, identity, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { NtsBaseStore } from '../base';
import { NtsState } from '../../state.models';

/**
 * Create an instance of a UI store
 */
export class NtsUIStoreCreator<t> extends NtsBaseStore {
  private state: t = { ...this.initialState };
  public state$ = new BehaviorSubject<t>({ ...this.state });

  /**
   * Return data from the store
   * @param k
   * @param options
   * @returns

  public select$: (k: keyof t, options?: NtsState.UIStoreOptions) => Observable<t[keyof t]> = (
    k: keyof t,
    options?: NtsState.UIStoreOptions,
  ) =>
    this.state$.pipe(
      map((s) => s[k]),
      switchMap((s) => {
        if (options?.disableDistinct) {
          return of(s);
        }
        return of(s).pipe(distinctUntilChanged());
      }),
    );
     */

  constructor(private initialState: t, private options?: NtsState.UIStoreOptions) {
    super();
    if (this.options?.persistId) {
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
  // public select$(k: (s: t) => t[keyof t], options?: NtsState.UIStoreOptions): Observable<t[keyof t]>;
  public select$(k: keyof t, options?: NtsState.UIStoreOptions): Observable<t[typeof k]> {
    return this.state$.pipe(
      map((s) => s[k]),
      // switchMap((v) => (options?.disableDistinct ? of(v) : of(v).pipe(distinctUntilChanged()))),
      options?.disableDistinct ? identity : distinctUntilChanged(),
    );
  }

  /**
   * Update data in the store
   * @param update
   * @returns A promise with the entire store state object
   */
  public update(value: Partial<t>): Promise<t>;
  public update(value: (s: t) => Partial<t>): Promise<t>;
  public update(value: unknown): Promise<t> {
    if (typeof value === 'function') {
      const n = value(this.state);
      this.stateChange(n);
    } else {
      this.stateChange(value as t);
    }

    if (this.options?.persistId) {
      localStorage.setItem(this.options?.persistId, JSON.stringify(this.state));
    }

    return this.state$.pipe(take(1)).toPromise();
  }

  /**
   * Update state of UI store
   * @param update
   */
  private stateChange(update: Partial<t>) {
    this.state = { ...this.state, ...update };
    this.state$.next(this.state);
  }
}

export const ntsUIStoreCreator = <t>(initialState: t, options?: NtsState.UIStoreOptions) =>
  new NtsUIStoreCreator<t>(initialState, options);
