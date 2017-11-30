import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@shared';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private auth: AuthService
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Check if a token is in session storage, if so user is authenticated
        if (window.localStorage.getItem('token')) {
            return true;// logged in so return true
		}
        
		return true; // Remove to enable auth guard
        //return false;
    }
}
