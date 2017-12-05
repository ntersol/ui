import { Component } from '@angular/core';
import { AuthService } from '@shared';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html'
})
export class NavComponent {

    /** Is the dropdown menu open on mobile */
    public isOpen: boolean = false;

    constructor(
        public auth: AuthService
    ) {
    }
    
}
