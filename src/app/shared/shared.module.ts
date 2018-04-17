import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// UI Store
import { UIModalService, UIStoreService, UiSelectorsService } from '$ui'; // , UIStoreReducer

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
  imports: [CommonModule],
  providers: [APP_PROVIDERS],
  declarations: [APP_EXPORTS],
  exports: [APP_EXPORTS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
