// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';

// Mello Labs Tools
import { DatagridModule } from '@mello-labs/datagrid';
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
import { NoContentComponent, LoginComponent, HomeComponent, QaComponent } from '@routes';

// Components
import {
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  ConfirmationModalComponent,
  LogoutModalComponent,
  LaunchModalComponent,
} from '@components';

// Shared
import {
  // App settings
  AppSettings,

  // Services
  ServiceWorkerService,
  PostMessageService,
  AppConfigService,
  AppCommsService,

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,
  AuthService,

  // Guards
  AuthGuard,

  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,

  // Directives
  FullScreenDirective,
} from '@shared';

import { UIModalService, UIStoreService, UIStoreReducer } from '@ui';
import { ApiService } from '@api';

// Application wide providers
export const APP_COMPONENTS = [
  NoContentComponent,
  LoginComponent,
  HomeComponent,
  QaComponent,

  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,

  ConfirmationModalComponent,
  LogoutModalComponent,
];

// Application wide providers
export const APP_PROVIDERS = [
  HttpInterceptorService,
  AuthService,
  ApiService,
  AppSettings,
  UIModalService,
  UIStoreService,
  AuthGuard,
  ServiceWorkerService,
  PostMessageService,
  AppConfigService,
  AppCommsService,

  // Angular Pipes
  DatePipe,
  CurrencyPipe,

  {
    // Global exception handler
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    APP_COMPONENTS,

    // Pipes
    FilterPipe,
    DebouncePipe,
    StringPipe,
    SortPipe,

    // Directives
    FullScreenDirective,
  ],
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.settings.enableServiceWorker }),

    NgbModule.forRoot(), // ng-bootstrap
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX

    // Mello Labs
    DatagridModule.forRoot(),
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
    UtilitiesModule.forRoot(),
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    { provide: APP_INITIALIZER, useFactory: AppInit, deps: [AppSettings, AppConfigService], multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationModalComponent, LogoutModalComponent],
})
export class AppModule {}

/**
 * Check if environment settings are already present, if not load first before the rest of the app
 * @param settings - App settings
 * @param config - Config service
 */
export function AppInit(settings: AppSettings, config: AppConfigService): () => Promise<any> {
  if (settings.apiUrl) {
    return (): Promise<any> => new Promise(resolve => resolve());
  } else {
    return (): Promise<any> => config.loadEnvSettings();
  }
}
