// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, ErrorHandler  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';
import { DatePipe, CurrencyPipe } from '@angular/common';

// Mello Labs Tools
import { ApiToolsModule, ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';
import { UtilitiesModule } from '@mello-labs/utilities';

// Main entrypoint component
import { AppComponent } from './app.component';
// Routing Module
import { ROUTES } from './app.routes';

// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

// Routes
import {
	NoContentComponent, LoginComponent, HomeComponent
} from '@routes';

// Components
import {
	FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
	ConfirmationModalComponent, LogoutModalComponent, 
	LaunchModalComponent
} from '@components';

// Shared
import {
	GlobalErrorHandler,
	AuthService,
	ApiService,
	ApiSelectors,
	AppSettings,
	UIModalService,
	UIService,
	UISelectors,

	// Interceptors
	AuthGuard,
	HttpInterceptorService,

    // Reducers
	StoreUIReducer,

	// Pipes

} from '@shared';

// Application wide providers
export const APP_COMPONENTS = [
	NoContentComponent, LoginComponent, HomeComponent,

	FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
	LaunchModalComponent,

	ConfirmationModalComponent, LogoutModalComponent 
];

// Application wide providers
export const APP_PROVIDERS = [
	HttpInterceptorService,
	AuthService,
	ApiService,
	ApiSelectors,
	AppSettings,
	UIModalService,
	UIService,
	UISelectors,
	AuthGuard,
	// Pipes
	DatePipe, CurrencyPipe,
    
	{// Global exception handler
		provide: ErrorHandler,
		useClass: GlobalErrorHandler
	},
];


@NgModule({
    declarations: [
	    AppComponent,
		APP_COMPONENTS
    ],
    imports: [
	    BrowserModule,
	    FormsModule, ReactiveFormsModule,
	    HttpClientModule,
	    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
		NgbModule.forRoot(),// Bootstrap
		StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: StoreUIReducer }),// NGRX

        // Mello Labs
		ApiToolsModule.forRoot(),
		FormToolsModule.forRoot(),
		UtilitiesModule.forRoot() 
    ],
    providers: [
	    APP_PROVIDERS,
        {
		    provide: HTTP_INTERCEPTORS,
		    useClass: HttpInterceptorService,
		    multi: true
	    }
    ],
	bootstrap: [AppComponent],
	entryComponents: [
		 ConfirmationModalComponent, LogoutModalComponent    
	]
})
export class AppModule { }
