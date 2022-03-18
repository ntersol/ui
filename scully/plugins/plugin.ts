import { log, registerPlugin, yellow } from '@scullyio/scully';

function skipPlugin(route, config = {}) {
  log(`Skip Route "${yellow(route)}"`);
  return Promise.resolve([]);
}

const validator = async (conf) => [];
registerPlugin('router', 'skip', skipPlugin, validator);
