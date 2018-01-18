import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { AuthService, AppSettings } from '@shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private title: Title,
		private authService: AuthService,
		private settings: AppSettings
	) {
		this.routeChange();
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
				while (route.firstChild) route = route.firstChild;
				return route;
			})
			.filter(route => route.outlet === 'primary')
			.mergeMap(route => route.data)
			.subscribe((event) => {
				this.title.setTitle(event['title']) // Change document title
				// If auth endpoint is available and not on the login page
				if (this.authService.hasAuthEndpoint && this.router.url.toLowerCase().indexOf('login') == -1) {
					this.authService.refreshTokenUpdate(); // On Route change, refresh authentication token
				}
			});
	} // end routeChange
}
