// @angular modules
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, Injector, NgModule } from '@angular/core'; // APP_INITIALIZER,
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoPreloading, PreloadAllModules, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { environment } from '../environments/environment';
// Main entrypoint component
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { NoContentComponent } from './routes/no-content/no-content.component';
import { GlobalErrorHandler } from './shared/interceptors/error.interceptor';
import { HttpInterceptorService } from './shared/interceptors/http.interceptor';
import { StringUtils } from './shared/utils';
import { SiteModule } from './site.module';

// Set Akita to work in prod mode in prod
if (environment.production) {
  enableAkitaProdMode();
}

const isServer = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * Tell Akita to persist state with the following options
 * Currently only set up with global UI State
 */
persistState({
  storage: isServer ? undefined : localStorage, // Session storage or local storage
  key: 'appState', // Property to set state under
  include: ['uiState', 'settings'], // Which stores to include
  // Obfuscate the app state
  serialize: (entity: JSON) => {
    let str = JSON.stringify(entity);
    str = StringUtils.pad(str, 75, 75);
    str = StringUtils.obfuscateAdd(str);
    str = StringUtils.charShift(str, 10);
    return str;
  },
  // De-obfuscate the app state
  deserialize: (str: string) => {
    // Handle initial state
    if (str === '{}') {
      return {};
    }
    try {
      str = StringUtils.charShift(str, -10);
      str = StringUtils.obfuscateRemove(str);
      str = StringUtils.trim(str, 75, 75);
      return JSON.parse(str);
    } catch (err) {
      console.error(err);
      return {};
    }
  },
});

// Enables faster prod mode, does disable some dirty error checking though
// enableProdMode();

// Components
export const APP_COMPONENTS = [
  // App component
  AppComponent,
  NoContentComponent,
];

export let InjectorInstance: Injector;

@NgModule({
  declarations: [APP_COMPONENTS],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {
      preloadingStrategy: environment.settings.preloadRoutes ? PreloadAllModules : NoPreloading,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      anchorScrolling: 'enabled',
    }),

    SiteModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.settings.enableServiceWorker,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    // AppConfigService, // App config/env settings

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
    // {
    //  provide: APP_INITIALIZER,
    //  useFactory: AppInit,
    //  deps: [AppSettings, AppConfigService],
    //  multi: true,
    // },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialog],
})
export class AppModule {
  constructor(private injector: Injector, @Inject(PLATFORM_ID) public platformId: object, @Inject(APP_ID) public appId: string) {
    InjectorInstance = this.injector;
    // const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    // console.log(`Running ${platform} with appId=${appId}`);
  }
}

/**
 * Check if environment settings are already present, if not load first before the rest of the app
 * @param settings - App settings
 * @param config - Config service

 export function AppInit(settings: AppSettings, config: AppConfigService): () => Promise<any> {
  if (settings.apiUrl) {
    return (): Promise<any> => new Promise(resolve => resolve());
  } else {
    return (): Promise<any> => config.loadEnvSettings(environment.endpoints.envConfig);
  }
 }
 */
