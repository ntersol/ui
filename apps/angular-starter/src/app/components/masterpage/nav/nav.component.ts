import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, debounceTime, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { SettingsService } from '$settings';

import { MenuItem } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { UiStateService } from '$ui';
import { AuthService, AuthState } from 'src/app/shared/services/project/auth.service';

const startCase = require('lodash/startCase');
const toLower = require('lodash/toLower');

@Component({
  selector: 'app-nav',
  styleUrls: ['./nav.component.scss'],
  templateUrl: './nav.component.html',
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  /** Is the dropdown menu open on mobile */
  public isOpen = false;
  /** Turn the username into title case */
  public userName = startCase(toLower(this.settings.userName));
  /**   Does the app have an update */
  public hasUpdate$ = this.ui.updateAvailable$;
  /** App version */
  public version$ = this.settings.version$;

  public navMenu: MenuItem[] = [
    {
      label: 'Home',
      icon: 'fas fa-tachometer mr-1',
      routerLink: '/',
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Demo Route',
      icon: 'fas fa-cubes mr-1',
      routerLink: '/route',
    },
  ];

  public utilityMenu: MenuItem[] = [
    {
      label: 'Version 1.0.0.5',
      icon: 'fas fa-tachometer mr-1',
      disabled: true,
    },
    {
      label: 'Sign Out',
      icon: 'fas fa-cubes mr-1',
      command: () => this.logOut(),
    },
  ];

  public sidebarVisible = false;

  /** Contains a boolean is the current screensize is above or below the mobile breakpoint */
  public isDesktop$ = fromEvent(window, 'resize').pipe(
    debounceTime(100),
    map(e => (e && e.target ? (<any>e).target.innerWidth : null)), // Extract window width
    startWith(window.innerWidth), // Start with window width
    map(width => (width >= 998 ? true : false)), // If window width is less than mobileBreakpoint return true
    distinctUntilChanged(), // Only update on changes
  );

  constructor(private auth: AuthService, private settings: SettingsService, private ui: UiStateService, private router: Router) {
    // On route change, if mobile nav is open close it
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => (this.sidebarVisible = false));
  }

  /**
   * Update application
   */
  public updateApp() {
    this.ui.updateAppModal();
  }

  /**
   * Log out
   */
  public logOut() {
    this.auth.logOut(AuthState.loggedOut);
  }
}
