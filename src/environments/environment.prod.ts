export const environment = {
  appName: 'Mello Labs Angular Starter',
  production: true,
  serviceWorker: false,
  /** Is this app going to communicate with other domains or instances of itself for multiscreen usage? */
  hasAppComms: false,
  /** Which domains to whitelist app messaging for security. Default same domain */
  appCommDomains: <string[]>[window.location.origin],
  /** Is authentication available. If not use workaround for initial login */
  hasAuthEndpoint: false,
  /** List of local dev domains. Keep empty in prod file. */
  devDomains: <string[]>[],
  /** Location to get environment variables */
  envSettingsUrl: 'api/config',
  /** Which UI store properties to not write to localstorage */
  uiStoreIgnoreProps: <string[]>[],
};
