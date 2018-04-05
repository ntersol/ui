import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AppSettings, AuthService } from '$shared';
import { environment } from '$env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private settings: AppSettings, private auth: AuthService) {}

  canActivate() {
    if (
      // If is on a dev domain and an auth endpoint is not yet available
      !environment.settings.enableAuth || // Remove this line when out of dev/prototype phase for additional security
      // OR a token and an api url are present
      (this.settings.token && this.settings.apiUrl)
    ) {
      return true; // logged in and has apiUrl so set true
    }
    this.auth.logOut();
    return false;
  }
}
