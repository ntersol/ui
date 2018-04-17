import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { environment } from '$env';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';

// Mello Labs Tools
import { ApiToolsModule, ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';

// import { ROUTES } from '../app.routes';

// UI Store
import { UIModalService, UIStoreService, UiSelectorsService, UIStoreReducer } from '$ui'; // , UIStoreReducer
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

// Pipes
export const APP_EXPORTS = [
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
    NgbModule.forRoot(),
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX
    // DatagridModule.forRoot(),
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
  ],
  providers: [APP_PROVIDERS],
  declarations: [APP_EXPORTS],
  exports: [APP_EXPORTS, FormsModule, ReactiveFormsModule, NgbModule, ApiToolsModule, FormToolsModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APP_PROVIDERS],
    };
  }
}
// console.log(SharedModule)
