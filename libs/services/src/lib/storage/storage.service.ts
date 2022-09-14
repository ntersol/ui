/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, fromEvent, identity, map, Observable, of, take, tap } from 'rxjs';

namespace Storage {
  export interface Options {
    /** If true, convert the response to JSON from a string */
    isJson?: boolean;
  }
  export interface JSON extends Options {
    isJson: true;
  }
  export interface NoJSON extends Options {
    isJson?: false | undefined;
  }
  // Observable options
  export interface Options$ extends Options {
    /** By default only distinct emissions are allowed through the observable. This allows all updates through */
    disableDistinct?: boolean;
  }
  export interface JSON$ extends Options$ {
    isJson: true;
  }
  export interface NoJSON$ extends Options$ {
    isJson?: false | undefined;
  }
}

/**
 * A wrapper for local & session storage
 *
 * Adds type safety, automatic json deserialization, observables and SSR support
 *
 * Requires keys used in the storage event
 * @example
 * type LocalStorageKeys = 'token' | 'user';
type SessionStorageKeys = 'someKey'

export class AppStorageService extends StorageService<LocalStorageKeys, SessionStorageKeys> {
      public token$ = this.localStorage.getItem$('token');
      public set token(token: string | null) {
        this.localStorage.setItem('token', token);
      }
      public get token() {
        return this.localStorage.getItem('token');
      }
}
 */
export class StorageService<LocalStorageKeys, SessionStorageKeys = void> {
  /** LocalStorage */
  public localStorage = new BaseStorageService<LocalStorageKeys>();
  /** SessionStorage */
  public sessionStorage = new BaseStorageService<SessionStorageKeys>(true);
}

/**
 * Base class for interacting with storage
 */
class BaseStorageService<Keys> {
  /** Is currently node  */
  private isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  /** Is currently a browser */
  private isBrowser = !this.isNode;

  /** Abstraction for storage to add support for SSR. Doesn't need to do anything other than catch methods and props */
  private _storage = {
    setItem: (_prop: string, _value: string) => {},
    getItem: (_prop: string): string | null => null,
    removeItem: (_prop: string) => {},
    clear: () => {},
    key: (_index: number): string | null => null,
    length: 0,
  };

  /** Listen to the storage event and update local storage when localstorage is updated in other tabs. Does not update on this tab  */
  public storageEvent$ = this.isBrowser ? fromEvent(window, 'storage').pipe(tap(() => this.update())) : of();

  /**
   * A Record of the storage object to keep track of changes for the observable
   * Note that while data is present in this object, the getItem$ observable pulls from storage NOT from this object
   * This ensures a single source of truth for storage data
   */
  private storage$ = new BehaviorSubject(this.getStorage());

  constructor(@Inject('') private useSessionStorage = false) {}

  /**
   * Returns the current value associated with the given key as an observable, or null if the given key does not exist.
   * @param key
   * @param options
   */
  public getItem$(key: Keys, options?: Storage.NoJSON$): Observable<string | null>;
  public getItem$<t>(key: Keys, options: Storage.JSON$): Observable<t | null>;
  public getItem$(key: Keys, options?: Storage.Options$) {
    return this.storage$.pipe(
      map(() => this.getItem(key, options)), // Get data from storage NOT from the observable object
      options?.disableDistinct ? identity : distinctUntilChanged(), // Allow non distinct emissions
    );
  }

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   * @param key
   * @param options
   */
  public getItem<t>(key: Keys, options: Storage.JSON): t | null;
  public getItem(key: Keys, options?: Storage.NoJSON): string | null;
  public getItem(key: Keys, options?: Storage.Options): string | null;
  public getItem(key: Keys, options?: Storage.Options) {
    const val = this.storage.getItem(String(key));
    if (val && options?.isJson) {
      return JSON.parse(val);
    }
    return val;
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously. Nill values will be removed instead

    Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)

    Dispatches a storage event on Window objects holding an equivalent Storage object.
   * @param key
   * @param value
   */
  public setItem<t>(key: Keys, value: t | null | undefined) {
    // If set item is a nill value, remove from storage instead
    if (!value) {
      this.removeItem(key);
    } else {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      this.storage.setItem(String(key), val);
    }

    this.storage$.pipe(take(1)).subscribe((s) => this.storage$.next({ ...s, [String(key)]: value }));
  }

  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.

     Dispatches a storage event on Window objects holding an equivalent Storage object.
   * @param key
   */
  public removeItem(key: Keys) {
    this.storage.removeItem(String(key));
    this.storage$.pipe(take(1)).subscribe((s) => {
      const storage = { ...s };
      delete storage[String(key)];
      this.storage$.next(storage);
    });
  }

  /**
   * Removes all key/value pairs, if there are any.

     Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  public clear() {
    this.storage.clear();
    this.storage$.next({});
  }

  /**
   * Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs.
   * @param index
   * @returns
   */
  public key(index: number): string | null {
    return this.storage.key(index);
  }

  /**
   * Returns the number of key/value pairs.
   * @returns
   */
  public length() {
    return this.storage?.length;
  }

  /**
   * Refresh all values in the observable from the storage object
   */
  public update() {
    this.storage$.next(this.getStorage());
  }

  /**
   * Convert the storage class into a Record for the observable
   * @returns
   */
  private getStorage(): Record<string, unknown> {
    return this.isBrowser && this.storage
      ? Object.keys(this.storage).reduce((a, b) => ({ ...a, [b]: this.storage.getItem(b) }), {})
      : {};
  }

  /**
   * Abstraction for local/session storage in SSR safe fashion
   */
  private get storage(): Storage {
    return this.isBrowser ? (this.useSessionStorage ? window?.sessionStorage : window?.localStorage) : this._storage;
  }
}
