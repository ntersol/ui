import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
import './scully/plugins/plugin';

export const config: ScullyConfig = {
  projectRoot: './apps/showcase/src',
  projectName: 'showcase',
  outDir: './dist/static',
  routes: {
    '/assets': {
      type: 'skip',
    },
    '/components': {
      type: 'skip',
    },
    '/404': {
      type: 'skip',
    },
  },
};
