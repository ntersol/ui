import { Component, OnInit, AfterContentChecked, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiService, ApiProps, AuthService } from 'app-shared';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit, AfterViewChecked {


    public isOpen: boolean = false;

    constructor(
        private router: Router,
        private api: ApiService,
        public auth: AuthService
    ) {
    }

	public ngOnInit() {
		
    }

    public ngAfterViewChecked(): void {
     
    }
    
}
