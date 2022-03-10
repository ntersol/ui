"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("@scullyio/scully-plugin-puppeteer");
require("./scully/plugins/plugin");
exports.config = {
    projectRoot: './apps/showcase/src',
    projectName: 'showcase',
    outDir: './dist/static',
    defaultPostRenderers: [],
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
