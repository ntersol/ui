// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  properties: {
    /** Name of application */
    appName: 'Mello Labs Angular Starter',
  },
  settings: {
    /** Is an authentication endpoint available. If so make sure to update the endpoints in this file */
    enableAuth: false,
    /** Enable service worker functionality */
    enableServiceWorker: false,
    /** Is this app going to communicate with other domains or instances of itself for multiscreen usage?
     * If so, whitelist domains in the domains.listenTo property */
    enableAppComms: true,
  },
  domains: {
    /** If App Comms is enabled, whitelist domains to accept messages from here */
    listenTo: <string[]>[window.location.origin],
  },
  endpoints: {
    /** Location to get environment and config settings */
    envConfig: 'assets/mock-data/env-settings.json',
    /** Login endpoint */
    authLogin: '/authentication/login',
    /** Refresh token endpoint */
    authTokenRefresh: '/authentication/token',
  },
  state: {
    /** Which UI store properties to not write to localstorage. IE do not persist confidential/personal information */
    uiStoreBlacklist: <string[]>[],
  },
};
