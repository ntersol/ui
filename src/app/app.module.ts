import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';
import { DatePipe, CurrencyPipe } from '@angular/common';



import { AppComponent } from './app.component';

import { } from '@routes';
import { LogoutModalComponent, ConfirmationModalComponent } from '@components';

// Shared
import {
	BaseApiStore,
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

	StoreApiReducer,
	StoreUIReducer,

	// Pipes
	SafeHtmlPipe,
	PhoneNumberPipe } from '@shared';

// Enables faster prod mode, does disable some dirty error checking though
import { enableProdMode, ErrorHandler } from '@angular/core';
enableProdMode(); 


// Application wide providers
export const APP_PROVIDERS = [
	BaseApiStore,
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
	  LogoutModalComponent, ConfirmationModalComponent,

	  SafeHtmlPipe, PhoneNumberPipe
  ],
  imports: [
	  BrowserModule,
	  StoreModule.forRoot({ api: StoreApiReducer, ui: StoreUIReducer }),// Inject stores here
  ],
  providers: [APP_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [LogoutModalComponent, ConfirmationModalComponent]
})
export class AppModule { }
