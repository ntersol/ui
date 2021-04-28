import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StoreConfig, Store, Query } from '@datorama/akita';
import { Settings } from './settings';

enum Props {
  token = 'token',
  userName = 'userName',
  version = 'version',
}

export function createInitialState(): Settings {
  return {
    token: null,
    userName: null,
    version: null,
  };
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  /** Is the browsers available, used for SSR/Angular universal */
  public isBrowser = isPlatformBrowser(this.platformId);

  /** Token for interacting with webapi */
  public token$ = this.query.select(state => state.token);
  /** Token for interacting with webapi */
  get token() {
    return this.settings.token;
  }
  set token(token: string | null) {
    this.settingSet(Props.token, token);
  }

  /** Username of current/last logged in user */
  public userName$ = this.query.select(state => state.userName);
  /** Username of current/last logged in user */
  get userName() {
    return this.settings.userName;
  }
  set userName(userName: string | null) {
    this.settingSet(Props.userName, userName);
  }

  /** Token for interacting with webapi */
  public version$ = this.query.select(state => state.token);
  /** Token for interacting with webapi */
  get version() {
    return this.settings.version;
  }
  set version(version: string | number | null) {
    this.settingSet(Props.version, version);
  }

  /** Holds the current synchronous value of the store. The getters retrieve data from this object */
  private settings = createInitialState();

  constructor(
    private store: SettingsStore,
    private query: SettingsQuery,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // On settings changes, update synchronous properties
    this.query.select().subscribe(state => (this.settings = { ...state }));
  }

  /**
   * Update properties in the store from the accessories
   * @param setting
   * @param value
   */
  private settingSet(setting: Props, value: any) {
    const stateNew: any = {};
    stateNew[setting] = value;
    this.store.update(stateNew);
  }

  /**
   * Reset store state
   */
  public reset() {
    this.store.reset();
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'settings', resettable: true })
export class SettingsStore extends Store<Settings> {
  constructor() {
    super(createInitialState());
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable({ providedIn: 'root' })
export class SettingsQuery extends Query<Settings> {
  constructor(protected store: SettingsStore) {
    super(store);
  }
}
