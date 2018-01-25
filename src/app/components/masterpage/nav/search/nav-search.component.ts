import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
		selector: 'nav-search',
		templateUrl: './nav-search.component.html'
})
export class NavSearchComponent implements OnInit {

		public search: any = {};

		constructor(
				private router: Router
		) {
		}

		public ngOnInit() {
				this.search.type = '';
		}


		public submit(): void {
				console.warn(this.search);
				this.router.navigate(['./search'])
		}

}
