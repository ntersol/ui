import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AppSettings, AuthService } from '@shared';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private settings: AppSettings,
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Check if a token is in session storage, if so user is authenticated. Also make sure api URL is present
    if (this.settings.token && this.settings.apiUrl) {
      return true;// logged in and has apiUrl so set true
    }
    this.auth.logOut();
    return false; // Remove to disable auth guard
  }
}
