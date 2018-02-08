import { Injectable } from '@angular/core';
import * as _ from 'lodash';

// Enum of app setting properties. Only needed if using the propGet and propSet methods in this file
enum Props {
  token = 'token',
  apiUrl = 'apiUrl',
  userName = 'userName',
}

// Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage/sessionstorage
@Injectable()
export class AppSettings {

  /** Development domains. Used for the isDev property to help set/disable functionality that may not be available yet */
  private domainsDev: string[] = ['localhost:4200', '127.0.0.1:8080', 'jerrolkrause.github.io'];

  /** Is this application in a development environment as defined by domainsDev and window.location.host */
  public get isDev(): boolean {
    return _.includes(this.domainsDev, window.location.host);
  }

  /** API token for EPS */
  private _token: string = null;
  /** API token for EPS */
  public get token(): string {
    return this.propGet(Props.token, 'sessionStorage');
  }
  public set token(value: string) {
    this.propSet(Props.token, value, 'sessionStorage');
  }

  /** Web Api Url */
  private _apiUrl: string = null;
  /** Web Api Url */
  public get apiUrl(): string {
    return this.propGet(Props.apiUrl);
  }
  public set apiUrl(value: string) {
    this.propSet(Props.apiUrl, value);
  }

  /** Username */
  private _userName: string = null;
  /** Username */
  public get userName(): string {
    return this.propGet(Props.userName);
  }
  public set userName(value: string) {
    this.propSet(Props.userName, value);
  }

  constructor(
  ) {
  }

  /**
  * Return a property. Loads it from this service first if available, if not looks in localstorage, if not there either return null
  * @param prop - App settings property
  * @param location - Location of locally stored prop, either sessionStorage or localStorage
  */
  private propGet(prop: string, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    if (!this['_' + prop] && window[location].getItem(prop)) {
      this['_' + prop] = window[location].getItem(prop);
    }
    return this['_' + prop] || null;
  }

  /**
  * Set an app settings property. Write to localstorage if present, delete from localstorage if null
  * @param prop - App settings property
  * @param location - Location of locally stored prop, either sessionStorage or localStorage
  */
  private propSet(prop: string, value: string, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    if (value) {
      window[location].setItem(prop, value);
      this['_' + prop] = value;
    } else {
      window[location].removeItem(prop);
      this['_' + prop] = null;
    }
  }

}
