// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { local } from './environment.local';
import { environment as defaults } from './environment.defaults';
import { EnvironmentConfig } from './environment.model';
import { mergeDeepRight } from 'ramda';
/**
 * Dev env config with local override
 */
export const environment: EnvironmentConfig = mergeDeepRight(
  defaults,
  // Overrides from local env file
  local,
);
