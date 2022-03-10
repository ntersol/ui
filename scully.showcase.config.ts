import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';
import '@scullyio/scully-plugin-puppeteer';
import './scully/plugins/plugin';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite];
setPluginConfig(baseHrefRewrite, { href: 'https://ntersol.github.io/ui/' });

export const config: ScullyConfig = {
  projectRoot: './apps/showcase/src',
  projectName: 'showcase',
  outDir: './dist/static',
  defaultPostRenderers: defaultPostRenderers,
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
