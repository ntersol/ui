import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AuthService, LoggingService, ApiService, UIService } from 'app-shared';

@Component({
  selector: 'login', 
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    public formMain: FormGroup;
    public waiting: boolean;
    public errorApi: IErrorApi;
	  public showErrorDetails: boolean = false;
    public sessionExpired: boolean = this.authService.sessionExpired;
    public showPassword: boolean = false;
	  public returnUrl: string;

	  public roles = ['Underwriting', 'Processing', 'Funding'];

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private loggingService: LoggingService,
		private api: ApiService,
		private ui: UIService
    ) {
    }

    public ngOnInit() {

        let isLogin, hasLogin;
		if (window.localStorage.rememberLogin && window.localStorage.userName) {
            isLogin = window.localStorage.userName;
		}

		if (window.localStorage.rememberLogin) {
			hasLogin = true;
		}

		this.route.queryParams.subscribe(params => {
				if (params.session == 'expired') {
					this.sessionExpired = true;
				}
			}).unsubscribe();
        
        
        window.clearTimeout(this.authService.sessionTimer); // When the page is loaded, clear any legacy timeouts
        this.authService.logOutModal = null; // Get rid of logout modal if it persists

        this.formMain = this.fb.group({ // <-- the parent FormGroup
			userName: [isLogin || '', [Validators.required]],
			password    : ['', [Validators.required]],
			remember    : [hasLogin],
			//channelId: ['2'],
			//screenId: ['1']
        });

        // get return url from route parameters or default to '/'
		this.returnUrl = '/'; // this.route.snapshot.queryParams['returnUrl'] || 
    }

    /**
    * Submit the form
    */
    public onLogin() {
        this.waiting = true;
		this.errorApi = null;
		this.showErrorDetails = false;

        // If remember username is set
		if (this.formMain.value.remember) {
		    window.localStorage.userName = this.formMain.value.userName;
		    window.localStorage.rememberLogin = true;
		} else {
		    window.localStorage.removeItem('rememberLogin');
		}
        
        this.authService.logIn(this.formMain.value).subscribe(
            (success) => {
                // If the API response returns 200 but the login is invalid
                if (success.status == 401 || success.status == 403) {
                    console.error('Weird Login State')
                }
                // Valid Login
				else {
					//this.loggingService.identify(this.formMain.value.userName); // Identify user to mixpanel
					//this.loggingService.trackEvent('User Logged In');
                     /*
                    // Now get user settings from the app
					this.api.getAppSettings(window.localStorage.webApiUrl + '/appSettings', true).subscribe(res => {
						//this.router.navigate([this.returnUrl]);

						if (res.UserName == '') {
                            console.error('Username came back empty, thats weird')
							window.localStorage.UserName = this.formMain.value.userName;
						}

						//console.warn('localstorage', res, JSON.parse(JSON.stringify(window.localStorage)));
						this.waiting = false;
						this.router.navigate([this.returnUrl]);

                       
                        // User has no pipeline or channel
						if (res.ChannelId == 0 || res.UserName == '') {
							this.ui.modals.open('ImpersonateModalComponent', {}, null);
						}
                        // Valid user with pipeline
						else {
							this.router.navigate([this.returnUrl]);
						}
                        
					});*/
                }
            },
			(error) => {
				error.errorMsg = 'Error logging in.';
				if (error.statusText = 'Unauthorized'){
					error.errorMsg = 'Invalid username or password, please try again.';
					this.showErrorDetails = false;
				}

				this.errorApi = error; 
				this.waiting = false;
            }
        )
          
    } // end onSubmit
    
}
