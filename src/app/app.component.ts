import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { environment } from '$env';
import { AuthService, ServiceWorkerService, AppCommsService, AppConfigService } from '$shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private authService: AuthService,
    private sw: ServiceWorkerService,
    private comms: AppCommsService,
    private config: AppConfigService
  ) {}

  ngOnInit() {
    this.routeChange();
    // Always refresh env settings after app load even if already present in localstorage
    // This protects against env setting getting stale when bypassing the app initializer
    this.config.loadEnvSettings();
    if (environment.settings.enableServiceWorker) {
      this.sw.enable();
    }
    if (environment.settings.enableAppComms) {
      this.comms.commsEnable();
    }
  }

  /**
   * Actions to perform on route change
   * Page titles are in app.routes.ts
   */
  public routeChange() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe(event => {
        this.title.setTitle(event['title'] + ' | ' + environment.properties.appName); // Change document title
        // If auth endpoint is available and not on the login page
        if (environment.settings.enableAuth && this.router.url.toLowerCase().indexOf('login') === -1) {
          this.authService.refreshTokenUpdate(); // On Route change, refresh authentication token
        }
      });
  } // end routeChange
}
