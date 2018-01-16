import { Injectable } from '@angular/core';

// Enum of app setting properties
enum Props {
	token = 'token',
	apiUrl = 'apiUrl',
	userName = 'userName',
}

@Injectable()
export class AppSettings {

	// Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage/sessionstorage

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
