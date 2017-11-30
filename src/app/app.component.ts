import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { AuthService } from '@shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private title: Title,
		private authService: AuthService
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
                // If not on the login page and not local dev, update the token
				if (window.location.host != 'localhost:4200' && this.router.url.toLowerCase().indexOf('login') == -1) {
					this.authService.refreshTokenUpdate(); // On Route change, refresh authentication token
				}
			});
	} // end routeChange
}
