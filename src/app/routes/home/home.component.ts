import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ApiService, UIService, ApiProps} from '@shared';

@Component({
    selector: 'home',
    styleUrls: [ './home.component.scss' ],
    templateUrl: './home.component.html',
    //encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy{

	public users$ = this.api.select.users$;
	public usersState$ = this.api.select.getState$(ApiProps.users);
	public formMain: FormGroup;
	public isEditing: boolean;

    /** Hold subs for unsub */ 
	private subs: Subscription[] = [];
    
	constructor(
		private api: ApiService,
		public ui: UIService,
		private fb: FormBuilder
	) {
	}
    
	public ngOnInit() {
		
        // Get users and load into store
		this.api.users.get().subscribe();
        // Formgroup
		this.formMain = this.fb.group({
			address: ['', []],
			company: ['', []],
			email: ['', []],
			id: ['', []],
			name: ['', [Validators.required]],
			phone: ['', []],
			username: ['', [Validators.required]],
			website: ['', []],
		});

	}

    /**
     * Refresh users
     */
	public usersRefresh() {
		this.api.users.get(true).subscribe();
	}

    /**
     * Load user into editing pane
     * @param user
     */
	public userEdit(user) {
		this.formMain.patchValue(user);
		this.isEditing = true;
	}

    /**
     * Delete user
     * @param user
     */
	public userDelete(user) {
		console.log('Delete User');
		this.api.users.delete(user).subscribe();
	}

    /**
     * Create/update user
     */
	public userSubmit() {
		if (this.isEditing) {
			this.api.users.put(this.formMain.value).subscribe(success => {
				this.formMain.reset();
				this.isEditing = false;
			});
		} else {
			this.api.users.post(this.formMain.value).subscribe(success => this.formMain.reset());
		}
	}


    ngOnDestroy() {
        if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()); } // Unsub
    }
    
}
