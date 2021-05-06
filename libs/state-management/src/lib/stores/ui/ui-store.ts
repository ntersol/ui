import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NtsBaseStore } from '../base';

interface UIStoreOptions {
  storeId?: string;
}
export declare type UpsertStateCallback<State, NewState extends Partial<State> = Partial<State>> = (
  state: State | {},
) => NewState;

type UIUpdate = <t>(v: t) => Partial<t>;

/**
 *
 */
export class NtsUIStoreCreator<t> extends NtsBaseStore {
  private state: t = { ...this.initialState };
  public state$ = new BehaviorSubject<t>({ ...this.state });

  //  options?: UIStoreSelectOptions
  public select$ = (k: keyof t) =>
    this.state$.pipe(
      map((s) => s[k]),
      distinctUntilChanged(),
    );

  constructor(private initialState: t, private options?: UIStoreOptions) {
    super();
    console.log(this.options);
  }

  /**
   *
   * @param update
   * @returns
   */
  public update(value: Partial<t>): Promise<t>;
  public update(value: UIUpdate): Promise<t>;
  public update(value: unknown): Promise<t> {
    if (typeof value === 'function') {
      const n = value(this.state);
      this.stateChange(n);
    } else {
      this.stateChange(value as t);
    }

    return this.state$.toPromise();
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

export const ntsUIStoreCreator = <t>(initialState: t, options?: UIStoreOptions) =>
  new NtsUIStoreCreator<t>(initialState, options);
