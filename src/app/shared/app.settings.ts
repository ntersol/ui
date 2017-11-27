import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {

    // Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage

	/** API token for EPS */
	private _token: string ;
	/** API token for EPS */
	public get token(): string {
		if (!this._token && window.localStorage.getItem('token')) {
			this._token = window.localStorage.getItem('token');
		}
		return this._token;
	}
	public set token(token: string) {
		window.localStorage.setItem('token', token);
		this._token = token;
	}

	/** Web Api Url */
	private _apiUrl: string;
	/** Web Api Url */
	public get apiUrl(): string {
		if (!this._apiUrl && window.localStorage.getItem('apiUrl')) {
			this._apiUrl = window.localStorage.getItem('apiUrl');
		}
		return this._apiUrl;
	}
	public set apiUrl(apiUrl: string) {
		window.localStorage.setItem('apiUrl', apiUrl);
		this._apiUrl = apiUrl;
	}

	/** Username */
	private _userName: string;
	/** Username */
	public get userName(): string {
		if (!this._userName && window.localStorage.getItem('userName')) {
			this._userName = window.localStorage.getItem('userName');
		}
		return this.userName;
	}
	public set userName(userName: string) {
		window.localStorage.setItem('userName', userName);
		this._userName = userName;
	}

	constructor(
	) {}

}
