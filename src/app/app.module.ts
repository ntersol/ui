// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, APP_INITIALIZER } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
// Main entrypoint component
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

// Import modules directly and NOT from barrels
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { HomeModule } from 'src/app/routes/home/home.module';

// Shared
import {
  // App settings
  AppSettings,
  // Services
  AppConfigService,
  // SharedModule,
} from '$shared';

// Routes
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
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),

    // Shared Modules
    SharedModule.forRoot(),
    ComponentsModule.forRoot(),

    HomeModule.forRoot(),
  ],
  providers: [{ provide: APP_INITIALIZER, useFactory: AppInit, deps: [AppSettings, AppConfigService], multi: true }],
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
