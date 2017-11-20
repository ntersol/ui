import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, Subscription } from "rxjs";
import 'rxjs/add/operator/share';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IStore, StoreActionsApi } from '@shared';

// TODO: Remove reference to localstorage in this file and add to api.service.ts

@Injectable()
export class BaseApiStore {

    protected cache: any = {} // Hold GET requests from an API using the URL as a primary key

    constructor(
        private http: Http,
        private store: Store<IStore.root>,
		private router: Router
    ) {
    }

    /**
     * Add token authorization to header requests
     */
	private getHeaders() {
		let headers = new Headers();
		headers.append('Authorization', 'Bearer ' + window.localStorage.getItem('token')); // Get token from session
        return { headers: headers };
	}

    /**
     * Make a GET request
     * @param url - The URL location of the webapi
     * @param updateCache - Refresh the version in the cache
     */
	public get<T>(url: string, updateCache: boolean = false): Observable<T> {
		// If this request is not in the cache or updateCache was requested (default behavior), load content into cache
		if (!this.cache[url] || updateCache) {
			this.cache[url] = this.http.get(url, this.getHeaders())
				.map(res => res.text() ? res.json() : {})
				.publishReplay(1)
				.refCount();
		}
		return this.cache[url];
	} // end get

    /**
     * Make a GET request and load the results into the store
     * @param url - The URL location of the webapi
     * @param id - The location to put the results in the store
     * @param updateCache - Refresh the version in the cache
     */
	protected getStore<T>(url: string, apiMap?: IStore.ApiMap, updateCache: boolean = false): Observable<T> {
        // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
		if (this.cache[url] == null || updateCache) {
			// Set status to waiting
			let newState: IStore.ApiStatus = { loading: true, loadError: false, loaded: false };
			this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
			this.cache[url] = this.http.get(url, this.getHeaders())
				.share()
				.map(res => {
					//Set status to success
					newState = { loading: false, loadError: false, loaded: true };
					this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
					let data = apiMap.map ? apiMap.map(res.json()) : res.json();
					this.store.dispatch({ type: StoreActionsApi.GET_COMPLETE, payload: { apiMap: apiMap, data: data } });// Load content into store
					return data;
				}).catch(error => {
					if (error.status == 401 || error.status == 403) {
						error.errorMsg = 'Please log in ';
						return this.endSession(error);
					} else {
						newState = { loading: false, loadError: error, loaded: false };
						this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
						return Observable.throw(error);
					}
				});
			return this.cache[url];
		} else {
			return Observable.of(<any>true);
		}
		
		//return this.cache[url];
    } // end get


    /**
     * Make a POST request
     * @param url - The URL location of the webapi
     * @param data - The data to pass to the server
     */
	public post<T>(url: string, data): Observable<T> {
		return this.http.post(url, data, this.getHeaders()).map(res => res.text() ? res.json() : {});
	} // end post


    /**
     * Make a POST request and load the results into the store
     * @param url - The URL location of the endpoint
     * @param id - The location to put the results in the store
     * @param data - The data to pass to the server
     */
	protected postStore<T>(url: string, apiMap: IStore.ApiMap, data: any): Observable<T> {
        // Set status to modifying
        let newState: IStore.ApiStatus = { modifying: true, modified : false, modifyError: false };
		this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
		return this.http.post(url, data, this.getHeaders())
			.map(res => {
				// Set status to complete
				let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };
				this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state

                // Check if the response has a payload or not, if not then this is an upSert
				let dataNew = res.text().length ? res.json() : data;
				this.store.dispatch({ type: StoreActionsApi.POST_COMPLETE, payload: { apiMap: apiMap, data: dataNew } });// Load content into store
				return Observable.of(res);
			}).catch(error => {
				if (error.status == 401 || error.status == 403) {
					error.errorMsg = 'Please log in ';
					return this.endSession(error);
				} else {
					error.errorMsg = 'Unable to create ' + apiMap.storeProperty;
					// Set status to error
					let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
					this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
					return Observable.throw(error);
				}
			});
    } // end post

    /**
     * Make a PUT request
     * @param url - The URL location of the webapi
     * @param data - The data to pass to the server
     */
	public put<T>(url: string, data: any): Observable<any> {
        return this.http.put(url, data, this.getHeaders()).map(res => res.text() ? res.json() : {});
	} // end post

    /**
     * Make a PUT request
     * @param url - The URL location of the webapi
     * @param data - The data to pass to the server
     */
	protected putStore<T>(url: string, apiMap: IStore.ApiMap, data: any): Observable<T> {
		//console.warn('Putting ', url, apiMap, data);
		// Set status to modifying
		let newState: IStore.ApiStatus = { modifying: true, modified: false, modifyError: false };
		this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
		return this.http.put(url, data, this.getHeaders())
			.map(res => {
				// Set status to complete
				let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };

				this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
				// Check if the response has a payload or not, if not then this is an upSert
				let dataNew = res.text().length ? res.json() : data;
				this.store.dispatch({ type: StoreActionsApi.PUT_COMPLETE, payload: { apiMap: apiMap, data: dataNew } });// Load content into store
				return Observable.of(res);
			}).catch(error => {
				console.warn('PUT Error, handle 403 unauth errors here', error);

				if (error.status == 401 || error.status == 403) {
					error.errorMsg = 'Please log in ';
					return this.endSession(error);
				} else {
					error.errorMsg = 'Unable to update ' + apiMap.storeProperty;
					// Set status to error
					let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
					this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
					return Observable.throw(error);
				}
			});
	} // end put

	/**
	 * Make a DELETE request
	 * @param url - The URL location of the webapi
	 * @param data - The data to pass to the server
	 */
	public delete<T>(url: string, data: any): Observable<T> {
		return this.http.delete(url, this.getHeaders()).map(res => res.text() ? res.json() : {});
	} // end post

  /**
  * Make a DELETE request
  * @param url - The URL location of the webapi
  * @param apiMap - The ApiMap object
  * @param element - The element or collection of elements being deleted
  */
	protected deleteStore<T>(url: string, apiMap: IStore.ApiMap, element:any | any[]): Observable<T> {
		// Set status to modifying
		let newState: IStore.ApiStatus = { modifying: true, modified: false, modifyError: false };
		this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
        // Delete doesn't natively support a body so this adds it in for deleting collections or other uncommon operations
		let options = new RequestOptions({
			...this.getHeaders(),
			body: element
		});

		return this.http.delete(url, options)
			.map(res => {
				// Set status to complete
				let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };
				this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
				this.store.dispatch({ type: StoreActionsApi.DELETE_COMPLETE, payload: { apiMap: apiMap, data: element } });// Load content into store
				return Observable.of(res);
			}).catch(error => {
				console.warn('DELETE Error, handle 403 unauth errors here', error);
				if (error.status == 401 || error.status == 403) {
					error.errorMsg = 'Please log in ';
					return this.endSession(error);
				} else {
					error.errorMsg = 'Unable to delete ' + apiMap.storeProperty;
					// Set status to error
					let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
					this.store.dispatch({ type: StoreActionsApi.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
					return Observable.throw(error);
				}
			});
	} // end post

    /**
     * When an authentication check fails
     * @param error
     */
	private endSession(error) {
		this.cache = {};
		window.localStorage.removeItem('token');
		window.sessionStorage.clear();
		this.router.navigate(['/login'], { queryParams: { session: 'expired' } });
		return Observable.throw(error);
	}
}
