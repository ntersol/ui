import { Injectable } from '@angular/core';

import { StringUtils } from '$utils';
import { environment } from '$env';

// Enum of app setting properties. Only needed if using the propGet and propSet methods in this file
export enum AppSettingsProps {
  token = 'token',
  apiUrl = 'apiUrl',
  userName = 'userName',
  lnkey = 'lnkey',
}

// Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage/sessionstorage
@Injectable()
export class AppSettings {
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
    this._apiUrl = value;
    this.propSet(AppSettingsProps.apiUrl, value);
  }

  /** Username */
  private _lnkey: string | null = null;
  /** Username */
  public get lnkey(): string | null {
    return this._lnkey || this.propGet(AppSettingsProps.lnkey);
  }
  public set lnkey(value: string | null) {
    this._lnkey = value;
    this.propSet(AppSettingsProps.lnkey, value);
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
  }

  /**
   * Return a property. Loads it from this service first if available, if not looks in localstorage, if not there either return null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propGet(propKey: string, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    const prop = environment.settings.obfuscate ? StringUtils.obfuscateAdd(propKey) : propKey;

    let value = window[location].getItem(prop) || null;
    // Obfuscate and pad
    if (value && environment.settings.obfuscate) {
      value = StringUtils.obfuscateRemove(window[location].getItem(prop));
      value = StringUtils.trim(value, 10, 10);
    }

    return value;
  }

  /**
   * Set an app settings property. Write to localstorage if present, delete from localstorage if null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propSet(propKey: string, value: string | null, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    let prop = propKey;
    let val = value;
    // Obfuscate and pad
    if (value && environment.settings.obfuscate) {
      prop = StringUtils.obfuscateAdd(propKey);
      val = StringUtils.pad(val, 10, 10);
      val = StringUtils.obfuscateAdd(value);
    }

    if (value) {
      window[location].setItem(prop, val);
    } else {
      window[location].removeItem(prop);
    }
  }

}
