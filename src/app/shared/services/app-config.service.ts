import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { AppSettings } from 'src/app/shared';
import { environment } from '$env';
import { Models } from '$models';

interface Settings {
  [key: string]: any;
}

/**
 * Manages receiving and setting initial environment settings
 */
@Injectable()
export class AppConfigService {
  constructor(private settings: AppSettings, private http: HttpClient) {}

  /**
   * Set all env settings in app settings
   * @param settings
   */
  public appSettingsUpdate(settings: Models.EnvSettings) {
    // Loop through all env properties passed by web api
    Object.keys(settings).forEach(key => {
      // Check to make sure this prop has been declared in app.settings and is not undefined
      // If defined, updated prop value
      // If not throw error
      let currentVal = (<Settings>this.settings)[_.camelCase(key)];
      if (currentVal !== undefined) {
        currentVal = (<Settings>settings)[key];
      } else {
        console.error(_.camelCase(key), `is not present in app settings`);
      }
    });
  }

  /**
   * Load environment settings
   */
  public loadEnvSettings(): Promise<any> {
    return this.http
      .get(environment.endpoints.envConfig)
      .toPromise()
      .then((data: any) => this.appSettingsUpdate(data))
      .catch((err: any) => {
        console.error('Error getting environment settings', err);
        sessionStorage.clear();
        return Promise.resolve();
      });
  }
}
