import { Injectable } from '@angular/core';
import { Map, AuthenticationType } from 'azure-maps-control';
import { NtsAzureMaps } from './azure-maps.models';

@Injectable({
  providedIn: 'root',
})
export class NtsAzureMapsService {
  private maps: Record<string, NtsAzureMaps.MapRef> = {};

  constructor() {}

  /**
   * Get a map reference
   * @param uniqueId
   */
  public get(uniqueId: string) {
    if (!!this.maps[uniqueId]) {
      return this.maps[uniqueId];
    }
    return null;
  }

  /**
   * Create a map and store it in memory
   * @param uniqueId
   * @param apiKey
   * @param options
   */
  public create(uniqueId: string, apiKey: string, options?: NtsAzureMaps.Options | null) {
    // Don't create a new instance if it already exists
    if (!!this.get(uniqueId)) {
      return this.get(uniqueId);
    }
    //console.log('Creating');
    // Create div element
    const elem = document.createElement('div');
    elem.id = uniqueId;
    // Create map instance
    const atlasMap = new Map(elem, {
      language: 'en-US',
      showLogo: false,
      showFeedbackLink: false,
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: apiKey,
      },
      style: 'road',
      zoom: 9,
      ...(options ?? {}),
    });

    this.maps = {
      ...this.maps,
      [uniqueId]: {
        elem: elem,
        map: atlasMap,
      },
    };

    return this.get(uniqueId);
  }
}
