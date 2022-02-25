import { JsonObject } from '@angular-devkit/core';
import { Options } from 'pwa-asset-generator/dist/models/options';

export interface Schema extends Options, JsonObject {
  // Path to source image to use for asset curation
  source: string;
  // Project to add assets to
  project?: string;
}
