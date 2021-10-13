import { NtsAzureMaps } from '../azure-maps.models';
import {
  markersAdd,
  dataSourcesChange,
  dataSourcesMerge,
  markersCleanup,
  settingsChange,
  layersChange,
  isNotNil,
  markersActiveUpdate,
} from '../utils';
import { isAction } from './azure-maps.actions';
// import atlas from 'azure-maps-control';

import { cloneDeep } from 'lodash';

/**
 * Make state changes to this mapbox instance
 * @param state
 * @param action
 */
export const azureMapsReducer = (state: NtsAzureMaps.State, action: { type: NtsAzureMaps.Actions; payload: any }): NtsAzureMaps.State => {
  // console.log('azureMapsReducer', action, cloneDeep(state));

  /**
   * When map loads
   */
  if (isAction.mapLoaded(action)) {
    state = { ...state, map: action.payload }; // zoom: action.payload

    // If fit bounds has been set, adjust map
    if (state?.actions?.cameraOptions && state.map) {
      state.map.setCamera(state.actions.cameraOptions);
      // For some reason centerOffset does not work when supplied with the main camera change
      if (state.actions.cameraOptions.centerOffset) {
        state.map.setCamera({ centerOffset: state.actions.cameraOptions.centerOffset });
      }
      // state.zoom = state.map.getZoom(); // Override zoom level
    }

    // If active markers have been supplied before map has loaded
    if (state.actions?.markersActive && state.map) {
      markersActiveUpdate(state.map, state.markersActive);
    }

    // Add layers
    if (state?.layers?.length) {
      layersChange(state.map, state.layers, state.settings);
    }

    // Add layers
    if (state?.dataSources?.length) {
      dataSourcesChange(state.map, state.dataSources);
    }

    // Add markers
    if (state.map && state.markers) {
      markersAdd(state.map, state.markers, state.settings);
    }

    // Settings/options changes
    if (state.map && state?.settings) {
      settingsChange(state.map, state?.settings);
    }

    return state;
  }

  /**
   * Settings changes
   */
  if (isAction.settingsChange(action)) {
    settingsChange(state.map, action.payload, state?.settings);
    return { ...state, settings: cloneDeep(action.payload) };
  }

  /**
   * Resize/redraw map
   */
  if (isAction.resize(action) && state.map) {
    state.map.resize();
  }

  /**
   * Fit Bounds
   */
  if (isAction.cameraOptions(action)) {
    // Map has not been loaded yet, store fitBounds in state to apply after map loads
    if (!state.map) {
      return { ...state, actions: { ...state.actions, cameraOptions: action.payload } };
    } else if (action.payload) {
      // If custom camera settings were supplied, use that
      state.map.setCamera(action.payload);
      // For some reason centerOffset does not work when supplied with the main camera change
      if (action.payload.centerOffset) {
        state.map.setCamera({ centerOffset: action.payload.centerOffset });
      }
    } else if (state.markers) {
      // Otherwise fit to the markers
      // mapFitBounds(state.map, state.markers);
    }
  }

  /**
   * Layers
   */
  if (isAction.layersAdd(action)) {
    // Convert to array
    const a = action.payload && Array.isArray(action.payload) ? [...action.payload] : action.payload;

    // Add new layers
    if (state.map && action.payload.length) {
      layersChange(state.map, a, state.settings);
    }

    return { ...state, layers: a };
  }

  /**
   * Add/update datasources
   */
  if (isAction.dataSourcesChange(action)) {
    let dataSources = action.payload;
    if (state.map) {
      dataSourcesChange(state.map, action.payload); // Add update sources in map
    } else {
      dataSources = dataSourcesMerge(state.dataSources, action.payload);
    }

    // If active markers have been supplied before map has loaded
    if (state.actions?.markersActive && state.map) {
      markersActiveUpdate(state.map, state.markersActive);
    }

    return { ...state, dataSources: dataSources };
  }

  /**
   * Markers
   */
  if (isAction.markersAdd(action)) {
    // Remove any pre-existing markers but only ones from the previously supplied payload
    if (state.map && state.markers) {
      const existingMarkerIds = state.markers.map(m => m.id).filter(isNotNil);
      const existingMarkers = state.map.markers.getMarkers().filter((m: any) => existingMarkerIds.includes(m.id));
      existingMarkers.forEach(m => state?.map?.markers.remove(m));
    }

    // If markers are added, update any active ones
    if (state.markersActive?.length) {
      markersActiveUpdate(state.map, state.markersActive);
    }

    // Add markers to map
    markersAdd(state.map, action.payload, state.settings);
    return { ...state, markers: [...action.payload] };
  }

  /**
   * Manage active markers
   */
  if (isAction.markersActiveAdd(action)) {
    const markersActive = Array.isArray(action.payload) ? [...action.payload] : action.payload;
    if (state.map) {
      markersActiveUpdate(state.map, markersActive);
    } else {
      return { ...state, markersActive: markersActive, actions: { ...state.actions, markersActive: markersActive } };
    }
    return { ...state, markersActive: markersActive };
  }

  /**
   * Zoom Change
   */
  if (isAction.zoomChange(action)) {
    if (state.map) {
      // Close all open popups on zoom
      state.map.markers.getMarkers().forEach(m => m.getOptions().popup?.close());
    }
    return { ...state, zoom: action.payload };
  }

  /**
   * Destroy/remove map and all memory usage
   */
  if (isAction.destroy(action)) {
    if (state.map) {
      markersCleanup(state.map); // Remove event listeners on markers and popups prior to being destroyed
      state.map.clear();
      state.map.dispose();
    }
    return {};
  }

  return state;
};
