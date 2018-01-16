import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppSettings } from 'src/app/shared/app.settings';


@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private settings: AppSettings
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		// Check if a token is in session storage, if so user is authenticated. Also make sure api URL is present
		if (this.settings.token && this.settings.apiUrl) {
			return true;// logged in so return true
		}

		return false; // Remove to disable auth guard
	}
}
