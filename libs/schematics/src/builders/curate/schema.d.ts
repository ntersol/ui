import { JsonObject } from '@angular-devkit/core';
import { Options } from 'pwa-asset-generator/dist/models/options';

export interface CurateSchema extends Options, JsonObject {
  // Path to source image to use for asset curation
  source: string;
  // Project to add assets to
  project?: string;
  // Page background to use when image source is provided: css value  [default: transparent]
  background?: string;
  // Shows white as canvas background and generates images without transparency  [default: true]
  opaque?: boolean;
  // Padding to use when image source provided: css value  [default: "10%"]
  padding?: string;
  // Scraping Apple Human Interface guidelines to fetch splash screen specs  [default: true]
  scrape?: boolean;
  // Web app manifest file path to automatically update manifest file with the generated icons
  manifest?: string;
  // Index HTML file path to automatically put splash screen and icon meta tags in
  index?: string;
  // Path prefix to prepend for href links generated for meta tags
  path?: string;
  // Override the path of images used in href/src tags of manifest and HTML files
  pathOverride?: string;
  // Image type: png|jpg  [default: jpg - with the exception of manifest files]
  type?: string;
  // Image quality: 0...100 (Only for JPG)  [default: 70]
  quality?: number;
  // Only generate splash screens  [default: false]
  splashOnly?: boolean;
  // Only generate icons  [default: false]
  iconOnly?: boolean;
  // Generate favicon image and HTML meta tag  [default: false]
  favicon?: boolean;
  // Generate Windows static tile icons and HTML meta tags  [default: false]
  mstile?: boolean;
  // Declare icons in manifest file as maskable icons  [default: true]
  maskable?: boolean;
  // Only generate landscape splash screens  [default: false]
  landscapeOnly?: boolean;
  // Only generate portrait splash screens  [default: false]
  portraitOnly?: boolean;
  // Generate iOS splash screen meta with (prefers-color-scheme: dark) media attr  [default: false]
  darkMode?: boolean;
  // Generate HTML meta tags with single quotes  [default: false]
  singleQuotes?: boolean;
  // Generate HTML meta tags by self-closing the tags  [default: false]
  xhtml?: boolean;
  // Logs the steps of the library process  [default: true]
  log?: boolean;
  // Disable sandbox on bundled Chromium on Linux platforms - not recommended  [default: false]
  noSandbox?: boolean;
}
