import * as pwaAssetGenerator from 'pwa-asset-generator';
import { Options } from 'pwa-asset-generator/dist/models/options';
import { Schema } from './schema';
export class Curator {
  private _outputDirectory: string;
  private _source: string;
  private _options?: Partial<Schema> | undefined;

  constructor(source: string, outputDirectory: string, options?: Partial<Schema> | undefined) {
    this._source = source;
    this._outputDirectory = outputDirectory;
    this._options = options;
  }

  async curate() {
    return await pwaAssetGenerator.generateImages(this._source, this._outputDirectory, this._options as Options);
  }
}
