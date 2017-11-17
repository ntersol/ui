import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Observable, Subscription } from "rxjs";
import 'rxjs/add/operator/map';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { IStore, StoreActionsApi, ApiMap, BaseApiStore } from '@shared';

import { LogoutModalComponent } from '@components';

@Injectable()
export class AuthService extends BaseApiStore {

    public sessionExpired: boolean = false;
    public modalDuration: number = 120; // 120 How long to show the modal window
    public sessionTimer: any = null; // Holds the logout session timer
    public logOutModal: NgbModalRef;

    constructor(
        private httpSvc: Http,
        private modalService: NgbModal,
		    private routerSvc: Router,
		    private storeSvc: Store<IStore.root>,
    ) {
		    super(httpSvc, storeSvc, routerSvc);
    }

    /**
     * Log the user in
     * @param data
     */
    public logIn(data): Observable<Response> {
        /*
        // Mock login
        let url = 'assets/mock-data/login.json';
        return this.get(url).map((response: any) => {
            window.sessionStorage.token = response.Token;
            this.setTimer(response.ExpirationSeconds);
            return response;
        });
        */
        let url = window.localStorage.webApiUrl + '/authentication/login';
		    return this.post(url, data).map((response: any) => {
			    window.localStorage.token = response.data.token;
			    console.warn('logIn', response, JSON.parse(JSON.stringify(window.localStorage)))
           this.sessionExpired = false;
			    this.setTimer(response.data.expirationSeconds);
          return response;
        });
    }// end LogIn

    /**
     * Refresh the token
     */
    public refreshToken():void {
        let url = window.localStorage.webApiUrl + '/authentication/token';
        /*
        // If a token is present, refresh it
        if (window.sessionStorage.token) {
            // Mock login
            url = this.webApiUrl + 'assets/mock-data/refreshtoken.json';
            this.get(url).subscribe((response: any) => {
                // console.log('Refreshing Token');
                window.sessionStorage.token = response.Token;
                this.setTimer(response.ExpirationSeconds);
                return response;
            });
        }

        */
        this.put(url, null).subscribe(
            (response: any) => {
                //Make sure a token is present before it is replaced
				if (window.localStorage.token) {
					//console.log('Refreshing token', response);
                    this.sessionExpired = false;
					window.localStorage.token = response.data.token;
					this.setTimer(response.data.expirationSeconds);
                }
                return response;
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
                this.refreshToken();
            }
        });
    } // end launchLogoutModal

    /**
     * Log the user out. Clear stored data and redirect to login page
     */
	public logOut(): void {
		console.log('Logging Out', window.localStorage);
		this.cache = {};
		clearTimeout(this.sessionTimer);
		window.localStorage.removeItem('token');
		this.routerSvc.navigate(['/login'], { queryParams: { returnUrl: this.routerSvc.url } });
		window.location.reload(); // TODO: Barf, get rid of this when possible. Currently there is a bug where the OLD token is persisting somewhere in the app and won't go away until refresh
    } // end LogOut

}
