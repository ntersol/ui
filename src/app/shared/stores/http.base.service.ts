import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';

import { ApiStatusActions } from './api/api.actions';

import { AppStore } from './store';

@Injectable()
export class ApiHttpService {
  /** Hold GET requests from an API using the URL as a primary key */
  protected cache: { [key: string]: Observable<any> } = {};

  constructor(private httpSvc: HttpClient, private storeSvc: Store<AppStore.Root>, private routerSvc: Router) { }
  
  /**
   * Make a GET request with simple caching
   * @param url - The URL location of the webapi
   * @param updateCache - Refresh the version in the cache
   */
  public get<T>(url: string, updateCache = false): Observable<T> {
    // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
    if (!this.cache[url] || updateCache) {
      this.cache[url] = this.httpSvc.get(url).pipe(share());
    }
    return this.cache[url];
  } // end get

  /**
   * Make a GET request and load the results into the store
   * @param url - The URL location of the webapi
   * @param id - The location to put the results in the store
   * @param updateCache - Refresh the version in the cache
   */
  protected getStore<T>(url: string, apiMap?: AppStore.ApiMap, updateCache = false): Observable<T> {

    // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
    if (this.cache[url] == null || updateCache) {

      // Update store with new state
      this.storeSvc.dispatch({type: ApiStatusActions.STATE_LOADING, payload: { apiMap: apiMap }}); 
      this.cache[url] = this.httpSvc.get(url).pipe(
        map(res => {
          const data = apiMap.map ? apiMap.map(res) : res;
          this.storeSvc.dispatch({
            type: ApiStatusActions.GET_COMPLETE,
            payload: { apiMap: apiMap, data: data },
          }); // Load content into store
          return data;
        }),
        catchError(error => {
          if (error.status === 401 || error.status === 403) {
            error.errorMsg = 'Please log in ';
            return this.endSession(error);
          } else {
            this.storeSvc.dispatch({
              type: ApiStatusActions.STATE_ERROR,
              payload: { apiMap: apiMap, payload: error },
            }); // Update store with new state
            return of(error);
          }
        }),
        share()
      );
      return this.cache[url];
    } else {
      return of(<any>true);
    }

    // return this.cache[url];
  }

  /**
   * Make a POST request and load the results into the store
   * @param url - The URL location of the endpoint
   * @param id - The location to put the results in the store
   * @param data - The data to pass to the server
   */
  protected postStore<T>(url: string, apiMap: AppStore.ApiMap, data: T): Observable<T> {

    // Update store with new state
    this.storeSvc.dispatch({ type: ApiStatusActions.STATE_MODIFYING, payload: { apiMap: apiMap }});

    return this.httpSvc.post(url, data).pipe(
      map((res: any) => {
        // Check if the response has a payload or not
        const dataNew = res ? res : data;
        this.storeSvc.dispatch({
          type: ApiStatusActions.POST_COMPLETE,
          payload: { apiMap: apiMap, data: dataNew },
        }); // Load content into store
        return dataNew;
      }),
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          error.errorMsg = 'Please log in ';
          return this.endSession(error);
        } else {
          error.errorMsg = 'Unable to create ' + apiMap.storeProperty;
          // Set status to error
          this.storeSvc.dispatch({ type: ApiStatusActions.STATE_ERROR, payload: { apiMap: apiMap, data: error } });
          return of(error);
        }
      }),
    );
  } // end post

  /**
   * Make an upsert via put. Upsert inserts if not found, updates if found
   * @param url - The URL location of the webapi
   * @param data - The data to pass to the server
   */
  protected upsertStore<T>(url: string, apiMap: AppStore.ApiMap, data: T | T[]): Observable<T> {

    // Update store with new state
    this.storeSvc.dispatch({ type: ApiStatusActions.STATE_MODIFYING, payload: { apiMap: apiMap } });

    return this.httpSvc.put(url, data).pipe(
      map(res => {
        // Check if the response has a payload or not, if not then this is an upSert
        const dataNew = res ? res : data;
        this.storeSvc.dispatch({
          type: ApiStatusActions.UPSERT_COMPLETE,
          payload: { apiMap: apiMap, data: dataNew },
        }); // Load content into store
        return dataNew;
      }),
      catchError(error => {
        console.warn('PUT Error, handle 403 unauth errors here', error);

        if (error.status === 401 || error.status === 403) {
          error.errorMsg = 'Please log in ';
          return this.endSession(error);
        } else {
          error.errorMsg = 'Unable to update ' + apiMap.storeProperty;
          // Set status to error
          this.storeSvc.dispatch({ type: ApiStatusActions.STATE_ERROR, payload: { apiMap: apiMap, data: error } });
          return of(error);
        }
      }),
    );
  } // end put

  /**
   * Make a PUT request
   * @param url - The URL location of the webapi
   * @param data - The data to pass to the server
   */
  protected putStore<T>(url: string, apiMap: AppStore.ApiMap, data: T | T[]): Observable<T> {

    // Update store with new state
    this.storeSvc.dispatch({ type: ApiStatusActions.STATE_MODIFYING, payload: { apiMap: apiMap } });

    return this.httpSvc.put(url, data).pipe(
      map(res => {
        // Check if the response has a payload or not,
        const dataNew = res ? res : data;
        this.storeSvc.dispatch({
          type: ApiStatusActions.PUT_COMPLETE,
          payload: { apiMap: apiMap, data: dataNew },
        }); // Load content into store
        return dataNew;
      }),
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          error.errorMsg = 'Please log in ';
          return this.endSession(error);
        } else {
          error.errorMsg = 'Unable to update ' + apiMap.storeProperty;
          this.storeSvc.dispatch({ type: ApiStatusActions.STATE_ERROR, payload: { apiMap: apiMap, data: error } });
          return of(error);
        }
      }),
    );
  } // end put

  /**
   * Make a DELETE request
   * @param url - The URL location of the webapi
   * @param apiMap - The ApiMap object
   * @param element - The element or collection of elements being deleted
   */
  protected deleteStore<T>(url: string, apiMap: AppStore.ApiMap, element: T | T[]) {
    // Update store with new state
    this.storeSvc.dispatch({ type: ApiStatusActions.STATE_MODIFYING, payload: { apiMap: apiMap } });
    // Delete doesn't natively support a body so this adds it in for deleting collections or other uncommon operations
    return this.httpSvc.request('delete', url, { body: element }).pipe(
      // return this.httpSvc.delete(url, , { body: element }) // Does not work with body, add back in when it does
      map(res => {
        this.storeSvc.dispatch({
          type: ApiStatusActions.DELETE_COMPLETE,
          payload: { apiMap: apiMap, data: element },
        }); // Load content into store
        return res;
      }),
      catchError(error => {
        console.warn('DELETE Error, handle 403 unauth errors here', error);
        if (error.status === 401 || error.status === 403) {
          error.errorMsg = 'Please log in ';
          return this.endSession(error);
        } else {
          error.errorMsg = 'Unable to delete ' + apiMap.storeProperty;
          this.storeSvc.dispatch({ type: ApiStatusActions.STATE_ERROR, payload: { apiMap: apiMap, data: error } });
          return of(error);
        }
      }),
    );
  } // end post


  /**
   * When an authentication check fails
   * @param error
   */
  private endSession(error: any) {
    this.cache = {};
    window.localStorage.removeItem('token');
    window.sessionStorage.clear();
    this.storeSvc.dispatch({ type: ApiStatusActions.RESET, payload: null }); // Clear out store on errors for security
    this.routerSvc.navigate(['/login'], { queryParams: { session: 'expired' } });
    return of(error);
  }
}
