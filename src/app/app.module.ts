// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// Global vendor modules
import { StoreModule } from '@ngrx/store';

// Mello Labs Tools
import { ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';
import { UIStoreReducer } from '$ui';

// Main entrypoint component
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { environment } from '$env';

// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

// Shared
import {
  AppSettings, // App settings
  AppConfigService, // App config/env settings

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,

  // Shared Module
  SharedModule,
} from '$shared';

// Non-lazy loaded routes
import { LoginComponent, NoContentComponent, QaComponent } from '$routes';

// Components
export const APP_COMPONENTS = [
  // App component
  AppComponent,
  // Routes
  LoginComponent,
  NoContentComponent,
  QaComponent,
];

@NgModule({
  declarations: [APP_COMPONENTS],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: environment.settings.preloadRoutes ? PreloadAllModules : NoPreloading,
    }),

    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.settings.enableServiceWorker }),

    // Shared Module
    SharedModule.forRoot(),
  ],
  providers: [
    AppSettings, // App settings
    AppConfigService, // App config/env settings

    // Global error handling
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    // HTTP interceptor for auth
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // App initializer for startup
    {
      provide: APP_INITIALIZER,
      useFactory: AppInit,
      deps: [AppSettings, AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
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
