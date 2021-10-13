import * as atlas from 'azure-maps-control';
import { NtsAzureMaps } from '..';
import { isBrowser } from './guards.utils';

/**
 * Manage settings and options changes
 * @param map
 * @param settingsNew
 * @param settingsPrev
 */
export const settingsChange = (
  map?: atlas.Map | null,
  settingsNew?: NtsAzureMaps.Settings | null,
  settingsPrev?: NtsAzureMaps.Settings | null,
) => {
  // Null checks, prev is optional
  if (!map || !settingsNew) {
    return;
  }

  // Change map style
  if (settingsNew.options?.style && settingsNew?.options?.style !== settingsPrev?.options?.style) {
    map?.setStyle(settingsNew.options?.style as any); // TODO: Switch to enum
  }
  if (map && settingsNew.options) {
    map.setUserInteraction(settingsNew.options);
    map.setServiceOptions(settingsNew.options);
  }
  // Enable/disable the map controls
  // TODO, support multi-instance maps. This will disable all controls for all maps
  if (settingsNew.controls?.options?.disabled !== settingsPrev?.controls?.options?.disabled) {
    // SSR check
    if (isBrowser) {
      const container = document.getElementsByClassName('atlas-control-container');
      const controls = container ? container[0]?.querySelectorAll('button') : null;
      if (controls) {
        Array.from(controls).forEach(e => (e.disabled = settingsNew.controls?.options?.disabled || false));
      }
    }
  }
};
