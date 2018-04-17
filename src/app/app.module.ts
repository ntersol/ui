// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, APP_INITIALIZER } from '@angular/core';

// Main entrypoint component
import { AppComponent } from './app.component';

// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

import { SharedModule } from './shared/shared.module';

// Shared
import {
  // App settings
  AppSettings,
  // Services
  AppConfigService,
  // SharedModule,
} from '$shared';

console.assert(SharedModule, "Uhoh, Something was not defined, likely part of a circular reference loop, app.module");

// Routes
import { LoginComponent, NoContentComponent, QaComponent, HomeComponent } from '$routes';

// Components Module
import { ComponentsModule } from '$components';

// Components
export const APP_COMPONENTS = [
  // App component
  AppComponent,
  LoginComponent,
  HomeComponent,
  NoContentComponent,
  QaComponent,
];

@NgModule({
  declarations: [APP_COMPONENTS],
  imports: [
    BrowserModule,
    // Shared Modules
    SharedModule.forRoot(),
    ComponentsModule.forRoot()
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
