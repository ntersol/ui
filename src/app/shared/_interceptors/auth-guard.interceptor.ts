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
		    if (window.localStorage.getItem('token') && window.localStorage.getItem('UserName')) {
            return true;// logged in so return true
        }
		    return true;
        //window.sessionStorage.clear();
        // not logged in so redirect to login page with the return url and return false
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        //return false;
    }
}
