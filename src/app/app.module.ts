// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

// 3rd party tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';
import { DatePipe, CurrencyPipe } from '@angular/common';

// Main entrypoint component
import { AppComponent } from './app.component';
// Routing Module
import { ROUTES } from './app.routes';
// Enables faster prod mode, does disable some dirty error checking though
import { enableProdMode, ErrorHandler } from '@angular/core';
enableProdMode();


// Routes
import {
	NoContentComponent, LoginComponent, HomeComponent
} from '@routes';

// Components
import {
	FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
	LogoutModalComponent, ConfirmationModalComponent,
    // Api Tools
	ApiStateComponent, ApiErrorComponent,
	// Form tools
	FieldComponent, FileUploadComponent
} from '@components';

// Shared
import {
	ApiHttpService,
	GlobalErrorHandler,
	LoggingService,
	AuthService,
	UtilitiesService,
	ApiService,
	ApiSelectors,
	UIModalService,
	UIService,
	UISelectors,
	// Interceptors
	AuthGuard,
	

	ApiReducer,
	ApiStatusReducer,
	StoreUIReducer,

	// Pipes
	SafeHtmlPipe,
	PhoneNumberPipe } from '@shared';
    
// Application wide providers
export const APP_COMPONENTS = [
	NoContentComponent, LoginComponent, HomeComponent,

	FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
	LogoutModalComponent, ConfirmationModalComponent,

	ApiStateComponent, ApiErrorComponent,
	FieldComponent, FileUploadComponent
];

// Application wide providers
export const APP_PROVIDERS = [
	ApiHttpService,
	GlobalErrorHandler,
	LoggingService,
	AuthService,
	UtilitiesService,
	ApiService,
	ApiSelectors,
	UIModalService,
	UIService,
	UISelectors,
	AuthGuard,
	// Pipes
	DatePipe, CurrencyPipe, SafeHtmlPipe,
	PhoneNumberPipe,
	{// Global exception handler
		provide: ErrorHandler,
		useClass: GlobalErrorHandler
	},
];


@NgModule({
	declarations: [
		AppComponent,
	  APP_COMPONENTS,

	  SafeHtmlPipe, PhoneNumberPipe
  ],
	imports: [
    // @angular
	  BrowserModule,
	  FormsModule,
	  ReactiveFormsModule,
	  HttpModule,
	  
	  RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
	  NgbModule.forRoot(),// Bootstrap
	  StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: StoreUIReducer}),// NGRX
  ],
  providers: [APP_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [LogoutModalComponent, ConfirmationModalComponent]
})
export class AppModule { }
