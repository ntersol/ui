import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';

export const config: ScullyConfig = {
  projectRoot: './apps/showcase/src',
  projectName: 'showcase',
  outDir: './dist/apps/showcase',
  routes: {},
};
