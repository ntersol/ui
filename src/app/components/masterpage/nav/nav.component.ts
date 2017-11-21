import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiService, ApiProps, AuthService } from 'app-shared';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit{

    /** Is the dropdown menu open on mobile */
    public isOpen: boolean = false;

    constructor(
        private router: Router,
        private api: ApiService,
        public auth: AuthService
    ) {
    }

	public ngOnInit() {
		
    }

}
