import { Injectable } from '@angular/core';


@Injectable()
export class UIStorageService {

	private _token: string;
	private _loanNumber: string;

    constructor(
	) {
	}

	get token(): string {return this._token;}
	set token(token: string) {
		window.localStorage.token = token;
		this._token = token;
	}

	get loanNumber(): string { return this._loanNumber; }
	set loanNumber(loanNumber: string) {
		window.sessionStorage.loanNumber = loanNumber;
		this._loanNumber = loanNumber;
	}

}