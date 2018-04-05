// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  appName: 'Mello Labs Angular Starter',
  production: false,
  serviceWorker: false,
  /** Is this app going to communicate with other domains or instances of itself for multiscreen usage? */
  hasAppComms: false,
  /** Which domains to whitelist app messaging for security. Default same domain */
  appCommDomains: <string[]>[window.location.origin],
  /** Is authentication available. If not use workaround for initial login */
  hasAuthEndpoint: false,
  /** List of local dev domains. Used for working locally when backend is not yet available */
  devDomains: <string[]>['localhost:4200', '127.0.0.1:8080', 'localhost:49152', 'jerrolkrause.github.io'],
  /** Location to get environment variables */
  envSettingsUrl: 'assets/mock-data/env-settings.json',
  /** Which UI store properties to not write to localstorage */
  uiStoreIgnoreProps: <string[]>[],
};
