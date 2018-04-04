import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
//import { environment } from '@env';

import { AppSettings, AuthService } from '@shared';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private settings: AppSettings, private auth: AuthService) {}

  canActivate() {
    if (
      // If NOT in production and is on dev domain
      // Add !environment.production && when in an actual prod file
      (this.settings.isDev) ||
      // OR a token and an api url are present
      (this.settings.token && this.settings.apiUrl)) {
      return true; // logged in and has apiUrl so set true
    }
    this.auth.logOut();
    return false; 
  }
}
