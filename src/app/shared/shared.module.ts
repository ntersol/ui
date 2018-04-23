import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { environment } from '$env';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
// Mello Labs Tools
import { ApiToolsModule, ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';
// UI Store
import { UIModalService, UIStoreService, UiSelectorsService, UIStoreReducer } from '$ui';
// API Store
import { ApiService, ApiSelectorsService } from '$api';

// Shared
import {
  // App settings
  AppSettings,

  // Services
  ServiceWorkerService,
  PostMessageService,
  AppConfigService,
  AppCommsService,
  AuthService,

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,

  // Guards
  AuthGuard,

  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,
  SafeHtmlPipe,
  PhoneNumberPipe,

  // Directives
  FullScreenDirective,
} from '$shared';

// Providers/services/interceptors/guards
export const APP_PROVIDERS = [
  AppSettings,
  ApiService,
  ApiSelectorsService,
  UIModalService,
  UIStoreService,
  UiSelectorsService,
  ServiceWorkerService,
  PostMessageService,
  AppConfigService,
  AppCommsService,
  AuthService,
  HttpInterceptorService,
  AuthGuard,
  DatePipe,
  CurrencyPipe,
  // Global error handling
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
  },
  // HTTP interceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true,
  },
];

// Pipes + Directives
export const APP_PIPES_DIRECTIVES = [
  // Directives
  FullScreenDirective,
  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,
  SafeHtmlPipe,
  PhoneNumberPipe,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.settings.enableServiceWorker }),

    // Vendor
    NgbModule.forRoot(), // ng-bootstrap
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX
    // Mello Labs Tools
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
  ],
  providers: [APP_PROVIDERS],
  declarations: [APP_PIPES_DIRECTIVES],
  // Export 3rd party dependencies so they are available in the rest of the app
  exports: [APP_PIPES_DIRECTIVES, FormsModule, ReactiveFormsModule, NgbModule, ApiToolsModule, FormToolsModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APP_PROVIDERS],
    };
  }
}
