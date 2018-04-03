import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppSettings, AppSettingsProps } from 'src/app/shared';
import { environment } from '@env';

@Injectable()
export class AppConfigService {

  constructor(
    private settings: AppSettings,
    private http: HttpClient
  ) { }

  /**
   * Set all env settings in app settings
   * @param settings
   */
  public appSettingsUpdate(settings: { [key in AppSettingsProps]: string }) {
    this.settings.apiUrl = settings.apiUrl;
  }

  /**
   * Load environment settings
   */
  public loadEnvSettings(): Promise<any> {
    return this.http
      .get(environment.envSettingsUrl)
      .toPromise()
      .then((data: any) => this.appSettingsUpdate(data))
      .catch((err: any) => {
        console.error('Error getting environment settings', err);
        sessionStorage.clear();
        return Promise.resolve();
      });
  }

}
