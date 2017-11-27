import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Observable, Subscription } from "rxjs";
import 'rxjs/add/operator/map';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

//import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { IStore, ApiActions, ApiMap, ApiHttpService, AppSettings } from '@shared';

import { LogoutModalComponent } from '@components';

@Injectable()
export class AuthService extends ApiHttpService {
    /** Is session expired */
	public sessionExpired: boolean = false;
    /** How long to show the modal window */
	public modalDuration: number = 120; // 120 
    /** Holds the logout session timer */
	public sessionTimer: any = null; // 
    /** Holds reference to logout modal */
	public logOutModal: NgbModalRef;
    /** The http call so a token can be refreshed with a callback and success method */
	public refreshToken = this.http.put(this.settings.apiUrl + '/authentication/token', null);

    constructor(
		private http: HttpClient,
        private modalService: NgbModal,
		private router: Router,
		private store: Store<IStore.root>,
		private settings: AppSettings
    ) {
		super(http, store, router);
    }

    /**
     * Log the user in
     * @param data
     */
    public logIn(data): Observable<Response> {
		let url = this.settings.apiUrl + '/authentication/login';
		return this.http.post(url, data).map((response: any) => {
			this.settings.token = response.data.token;
            this.sessionExpired = false;
            this.setTimer(response.data.expirationSeconds);
            return response;
		});
    }// end LogIn

    /**
     * Refresh the token
     */
	public refreshTokenUpdate(): void {
		this.refreshToken.subscribe(
            (response: any) => {
                //Make sure a token is present before it is replaced
				if (this.settings.token) {
					//console.log('Refreshing token', response);
                    this.sessionExpired = false;
					this.settings.token = response.data.token;
					this.setTimer(response.data.expirationSeconds);
                }
                return true;
            },
            (response: any) => {
                //console.log('Error refreshing token');
                this.logOut();
            }
        )
    } // end RefreshToken

    /**
     * Set a countdown timer that pops a modal window when the user is close to session timeout
     * @param ExpirationSeconds
     */
    private setTimer(ExpirationSeconds: number): void {
        // console.log('Setting session timer to ', ExpirationSeconds, ' seconds');
        clearTimeout(this.sessionTimer);
        // ExpirationSeconds = 20;
        this.sessionTimer = setTimeout(() => {
            // console.log('Timer Expired');
			  this.sessionExpired = true;
            this.launchLogoutModal();
        }, (ExpirationSeconds - this.modalDuration * 2) * 1000); // Double the modal duration to add a buffer between server countdown and browser countdown
    } // end SetTimer

    /**
     * Launch a modal window which gives the user a chance to continue working
     */
    private launchLogoutModal(): void {
        // console.log('launchLogoutModal');
        clearTimeout(this.sessionTimer);
        this.logOutModal = this.modalService.open(LogoutModalComponent, <any>{ size: 'md' });
        this.logOutModal.componentInstance.modalDuration = this.modalDuration; // Pass duration to timeout modal

        // When the modal is closed via log out button
        this.logOutModal.result.then((closeReason) => {
            this.logOut();
        }, (dismissReason) => {// When modal is dismissed
            if (dismissReason != 'norefresh'){ 
				this.refreshTokenUpdate();
            }
        });
    } // end launchLogoutModal

    /**
     * Log the user out. Clear stored data and redirect to login page
     */
	public logOut(): void {
		this.cache = {};
		clearTimeout(this.sessionTimer);
		window.localStorage.removeItem('token');
		window.sessionStorage.removeItem('token');
		this.settings.token = null;
		this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } // end LogOut

}
