/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  /** Is currently node  */
  public isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  /** Is currently a browser */
  public isBrowser = !this.isNode;

  /** Abstraction for localstorage. Doesn't need to do anything other than catch methods and props */
  private _storage = {
    setItem: (_prop: string, _value: string) => {},
    getItem: (_prop: string): string | null => null,
    removeItem: (_prop: string) => {},
    clear: () => {},
    key: (_index: number): string | null => null,
    length: 0,
  };

  constructor(@Inject(DOCUMENT) private _doc: Document) {}

  /**
   * Get DOM window
   * @returns
   */
  get window(): Window | null {
    return this.isBrowser ? window : this._doc.defaultView;
  }

  /**
   * Get DOM document
   * @returns
   */
  get document(): Document | null {
    return this.isBrowser ? document : this._doc;
  }

  /**
   * Get DOM location
   * @returns
   */
  get location(): Location | null {
    return this.isBrowser ? document.location : this._doc.location;
  }

  /**
   * Abstraction for localstorage
   */
  get localStorage(): Storage | null {
    return this.isBrowser ? window.localStorage : this._storage;
  }

  /**
   * Abstraction for localstorage
   */
  get sessionStorage(): Storage | null {
    return this.isBrowser ? window.sessionStorage : this._storage;
  }
}
