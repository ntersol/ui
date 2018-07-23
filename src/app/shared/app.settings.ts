import { Injectable } from '@angular/core';

import { StringUtils } from '$utils';
import { environment } from '$env';

// Enum of app setting properties. Only needed if using the propGet and propSet methods in this file
export enum AppSettingsProps {
  token = 'token',
  apiUrl = 'apiUrl',
  userName = 'userName'
}

type Propkey = keyof typeof AppSettingsProps;

// Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage/sessionstorage
@Injectable()
export class AppSettings {
  /** Property to store app settings in local or session storage */
  private localProp = 'settings-app-' + environment.properties.appName.length;
  /** If obfusicated, pad settings with this many characters */
  private pad = 100;
  private localStorage: {[key in AppSettingsProps]?: string } = {};
  private sessionStorage: {[key in AppSettingsProps]?: string } = {};

  /** API token for EPS */
  private _token: string | null = null;
  /** API token for EPS */
  public get token(): string | null {
    return this._token || this.propGet(AppSettingsProps.token);
  }
  public set token(value: string | null) {
    this._token = value;
    this.propSet(AppSettingsProps.token, value);
  }

  /** Web Api Url */
  private _apiUrl: string | null = null;
  /** Web Api Url */
  public get apiUrl(): string | null {
    return this._apiUrl || this.propGet(AppSettingsProps.apiUrl);
  }
  public set apiUrl(value: string | null) {
    // console.log('apiUrl', value);
    this._apiUrl = value;
    this.propSet(AppSettingsProps.apiUrl, value);
  }

  /** Username */
  private _userName: string | null = null;
  /** Username */
  public get userName(): string | null {
    return this._userName || this.propGet(AppSettingsProps.userName);
  }
  public set userName(value: string | null) {
    this._userName = value;
    this.propSet(AppSettingsProps.userName, value);
  }

  constructor() {
    if (window.sessionStorage.getItem(this.localProp)) {
      this.sessionStorage = this.settingsRestore(window.sessionStorage.getItem(this.localProp));
    }
    if (window.localStorage.getItem(this.localProp)) {
      this.localStorage = this.settingsRestore(window.localStorage.getItem(this.localProp));
    }
  }

  /**
   * Return a property. Loads it from this service first if available, if not looks in localstorage, if not there either return null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propGet(propKey: Propkey, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    if (location === 'sessionStorage' && this.sessionStorage[propKey]) {
      return this.sessionStorage[propKey];
    } else if (this.localStorage[propKey]) {
      return this.localStorage[propKey];
    }
    return null;
  }

  /**
   * Set an app settings property. Write to localstorage if present, delete from localstorage if null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propSet(
    propKey: Propkey,
    value: string | null,
    location: 'localStorage' | 'sessionStorage' = 'localStorage',
  ) {
    if (location === 'sessionStorage') {
      this.sessionStorage[propKey] = value;
      window.sessionStorage.setItem(this.localProp, this.settingsSave(this.sessionStorage));
    } else {
      this.localStorage[propKey] = value;
      window.localStorage.setItem(this.localProp, this.settingsSave(this.localStorage));
    }
  }

  /**
   * Return an object that has been obfuscated into a string
   * @param state
   */
  private settingsSave(state: Object) {

    try {
      if (state) {
        let str = JSON.stringify(state);
        if (environment.settings.obfuscate) {
          str = StringUtils.pad(str, this.pad, this.pad);
          str = StringUtils.obfuscateAdd(str);
        }
        return str;
      }
    } catch (err) {
      return null;
    }

  }

  /**
   * Return an object that has been de-obfuscated
   * @param state
   */
  private settingsRestore(state: string) {
    try {
      if (state) {
        let str = state;
        if (environment.settings.obfuscate) {
          str = StringUtils.obfuscateRemove(state);
          str = StringUtils.trim(str, this.pad, this.pad);
        }
        const obj = JSON.parse(str);
        return obj;
      }
    } catch (err) {
      return null;
    }
  }
}
