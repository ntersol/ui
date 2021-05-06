import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { NtsBaseStore } from '../base';
import { UIStoreSelectOptions } from './ui-store.models';

export interface UIStoreConfig {
  storeId?: string;
}

export type UIUpdate = <t>(v: t) => Partial<t>;

/**
 *
 */
export class NtsUIStoreCreator<t> extends NtsBaseStore {
  private state: t = { ...this.initialState };
  public state$ = new BehaviorSubject<t>({ ...this.state });

  /**
   * Return data from the store
   * @param k
   * @param options
   * @returns
   */
  public select$ = (k: keyof t, options?: UIStoreSelectOptions) =>
    this.state$.pipe(
      map((s) => s[k]),
      switchMap((s) => {
        if (options?.disableDistinct) {
          of(s);
        }
        return of(s).pipe(distinctUntilChanged());
      }),
    );

  constructor(private initialState: t, private config: UIStoreConfig = {}) {
    super();
    if (this.config.storeId) {
      this.events$.pipe(filter((a) => a.storeId === this.config.storeId)).subscribe((a) => {
        console.log(a);
      });
    }
  }

  /**
   *
   * @param update
   * @returns
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

export const ntsUIStoreCreator = <t>(initialState: t, options: UIStoreConfig = {}) =>
  new NtsUIStoreCreator<t>(initialState, options);
